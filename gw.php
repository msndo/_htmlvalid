<?php include_once(getcwd() . '/app/conf-common.php'); ?>
<?php include_once(getcwd() . '/app/library/list-file.php'); ?>
<?php include_once(getcwd() . '/app/controller.php'); ?>
<?php
$confCommon = new ConfCommon;
$url = preg_replace('/^(.*\/\/)(.*?)$/', '${1}' . '${2}', htmlspecialchars($_GET['url'], ENT_QUOTES, 'UTF-8'));

$listConfHttpRequest = array();
if(!empty($confCommon -> listConf['authId']) && !empty($confCommon -> listConf['authPass'])) {
	$listConfHttpRequest['header'] = "Authorization: Basic " . base64_encode($confCommon -> listConf['authId']. ':' . $confCommon -> listConf['authPass']);
}

$contextStream = stream_context_create(array(
	'http' => $listConfHttpRequest
));

$responseBody = file_get_contents($url, false, $contextStream);

header('Content-Type: text/html; charset=utf-8');
echo($responseBody);
?>
