<?php
/**
 * AI Finder — same-origin proxy for the FreeSerp API.
 *
 * Why: FreeSerp answers with a duplicated `Access-Control-Allow-Origin: *, *`
 * header, so browsers block direct requests from other origins. This file runs
 * on any ordinary PHP hosting next to the static site and forwards requests
 * server-side (no CORS involved, because the browser calls its own domain).
 *
 * Safety: GET only, fixed upstream URL, whitelisted parameters only,
 * index/category are forced to sites/ai. It cannot be used as an open proxy.
 * No API key or secret is needed or stored.
 */

const UPSTREAM = 'https://freeserp.ai/api.php';
const TIMEOUT = 15;          // seconds
const CACHE_TTL = 60;        // seconds; 0 disables the small file cache

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Allow: GET');
    fail(405, 'Method not allowed');
}

/** Length limit that works with or without the mbstring extension. */
function cut(string $value, int $length): string {
    return function_exists('mb_substr') ? mb_substr($value, 0, $length, 'UTF-8') : substr($value, 0, $length);
}

/* ---------- build a clean, whitelisted query ---------- */
$in = $_GET;
$params = ['index' => 'sites', 'category' => 'ai'];

$sorts = ['relevance', 'went_live', 'dr', 'domain', 'first_seen'];
if (isset($in['sort']) && in_array($in['sort'], $sorts, true)) $params['sort'] = $in['sort'];
if (isset($in['order']) && in_array($in['order'], ['asc', 'desc'], true)) $params['order'] = $in['order'];

if (isset($in['q']) && is_string($in['q'])) {
    $q = trim(cut($in['q'], 200));
    if ($q !== '') $params['q'] = $q;
}
if (isset($in['ai_categories']) && is_string($in['ai_categories']) && $in['ai_categories'] !== '') {
    $params['ai_categories'] = cut($in['ai_categories'], 80);
}
if (isset($in['ai_startups']) && $in['ai_startups'] === '1') $params['ai_startups'] = '1';

$size = isset($in['size']) ? max(1, min(100, (int) $in['size'])) : 24;
$from = isset($in['from']) ? max(0, (int) $in['from']) : 0;
if ($from + $size > 10000) fail(400, 'from + size must be <= 10000');
$params['from'] = $from;
$params['size'] = $size;

$url = UPSTREAM . '?' . http_build_query($params);

/* ---------- tiny file cache (optional, best effort) ---------- */
$cacheFile = null;
if (CACHE_TTL > 0) {
    $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'ai-finder-cache';
    if (is_dir($dir) || @mkdir($dir, 0700, true)) {
        // now and then, drop entries older than an hour so the folder can't grow forever
        if (mt_rand(1, 50) === 1) {
            foreach (glob($dir . DIRECTORY_SEPARATOR . '*.json') ?: [] as $old) {
                if (time() - @filemtime($old) > 3600) @unlink($old);
            }
        }
        $cacheFile = $dir . DIRECTORY_SEPARATOR . sha1($url) . '.json';
        if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TTL) {
            header('X-Proxy-Cache: HIT');
            header('Cache-Control: public, max-age=' . CACHE_TTL);
            readfile($cacheFile);
            exit;
        }
    }
}

/* ---------- fetch upstream ---------- */
$status = 0;
$body = false;

if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => TIMEOUT,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
        CURLOPT_USERAGENT => 'AI-Finder/1.0 (+proxy)',
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
} elseif (ini_get('allow_url_fopen')) {
    $context = stream_context_create(['http' => [
        'method' => 'GET',
        'timeout' => TIMEOUT,
        'ignore_errors' => true,
        'header' => "Accept: application/json\r\nUser-Agent: AI-Finder/1.0 (+proxy)\r\n",
    ]]);
    $body = @file_get_contents($url, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
} else {
    fail(500, 'The server has neither cURL nor allow_url_fopen enabled');
}

if ($body === false || $status === 0) fail(502, 'FreeSerp API is unreachable');

http_response_code($status);
if ($status === 200) {
    header('Cache-Control: public, max-age=' . CACHE_TTL);
    if ($cacheFile) @file_put_contents($cacheFile, $body, LOCK_EX);
}
echo $body;
