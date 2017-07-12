<?php include_once(getcwd() . '/app/conf-common.php'); ?>
<?php include_once(getcwd() . '/app/library/list-file.php'); ?>
<?php include_once(getcwd() . '/app/controller.php'); ?>
<?php
$confCommon = new ConfCommon;
//var_dump($confCommon -> listConf);
?>
<!DOCTYPE html>
<html lang="ja">

<head>
<title><?php echo($confCommon -> listConf['titlePage']); ?></title>
<meta charset="utf-8">

<link rel="stylesheet" href="css/global.css">

<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>

<script>
var confGlobal = {
    listMessageIgnore: [ <?php if(!empty($confCommon -> listConf['listMessageIgnore'])) { echo('\'' . implode('\',\'', $confCommon -> listConf['listMessageIgnore']) . '\''); } ?> ],
    urlValidator: '<?php echo($confCommon -> listConf['urlValidator']); ?>'
};
</script>
<script src="js/common.js"></script>
</head>

<body>
<h1 id="title-page"><?php echo($confCommon -> listConf['titlePage']); ?></h1>

<div class="section-icon-loading"> <div class='uil-ellipsis-css icon-loading' style='transform:scale(0.6);'><div class="ib"><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div><div class="circle"><div></div></div></div></div></div>

<div id="contents">

<div class="section-ctrl-condition">
<dl class="ctrl-condition clr" id="ctrl-condition-allerror">
<dt>すべてのエラーを受信</dt><dd><div class="ctrl-checkbox trigger-ctrl ctrl-inact" data-status-ctrl="inact"><span class="text-actv">する</span><span class="text-inact">しない</span></div></dd>
</dl>
</div>

<table id="list-url" class="list-data">
<!-- ========================================================== Table Header -->
<thead>
<tr>
<th>No</th>
<th>タイトル</th>
<th><?php echo($confCommon -> listConf['urlPrefix']); ?></th>

<th>バリデート
<div class="section-toggle-autotrigger">
<a id="toggle-ctrl-autotrigger" class="toggle-ctrl" href="javascript: void(0);">(Auto ▼)</a>
</div>

<div class="section-ctrl-autotrigger">
<div class="section-menu-autotrigger section-menu-not-ranged">
<span class="content-ctrl">実行範囲を選択(バリデート列の余白をドラッグまたはタップ)</span>
</div>

<div class="section-menu-autotrigger section-menu-start-on-selected">
<a class="content-ctrl" href="javascript: void(0);">選択ページをバリデート</a>
</div>

<div class="section-menu-autotrigger section-menu-start-on-all">
<a class="content-ctrl" href="javascript: void(0);">Validate All ▶</a>
</div>

<div class="section-menu-transport" data-status-loop="break">
<div class="section-menu-start">
<a class="content-ctrl" href="javascript: void(0);">▶</a>
</div>

<div class="section-menu-pause">
<a class="content-ctrl" href="javascript: void(0);">||</a>
</div>
<!-- /section-menu-transport --></div>

</div>
</th>

<th>バリデート結果</th>
</tr>
</thead>
<!-- ========================================================== /Table Header -->

<!-- ========================================================== Table Body -->
<tbody>
<?php $ixRow = 1; ?>

<?php foreach(listFile(preg_replace('/\/[^\/]*?$/', '', $confCommon -> listConf['appRoot']) . $confCommon -> listConf['dirFilter']) as $file) : ?>
<?php
$htmlTarg = $file;
if(! file_exists($htmlTarg)) { continue; }
$contHtml = file_get_contents($htmlTarg);
if(empty($contHtml)) { continue; }
$titleTarg = htmlspecialchars(preg_replace('/^.*<title>(.*?)<\/title>.*$/si', '${1}', $contHtml), ENT_QUOTES, 'utf-8');
if($titleTarg == $contHtml ) { $titleTarg = 'No &lt;Title&gt;'; }
?>

<tr>
<th class="cell-num"><?php echo($ixRow); ?></th>
<th class="cell-title-row"><span class="cont-title-row"><?php echo(preg_replace('/ \|.*?$/', '', $titleTarg)); ?> </span></th>

<?php $ixDataCol = 1; ?>
<?php $urlTarg = str_replace($confCommon -> listConf['pathPrefix'] . '/', $confCommon -> listConf['urlPrefix'], $file); ?>
<td class="col-data" data-colidx="<?php echo($ixDataCol); ?>"><a href="<?php echo($urlTarg); ?>" target="_blank"><?php echo($urlTarg); ?></a></td>

<td class="col-submit">
<button class="bt-submit-validation" style="float: left;">バリデート</button>
<a class="ctrl-autotrigger-from" href="javascript: void(0);">連続 ↓</a>
</td>
<td class="col-result"></td>
</tr>
<?php $ixRow ++; ?>
<?php endforeach ?>

</tbody>
<!-- ========================================================== Table Body -->
</table>

<!-- /contents --></div>
</body>
</html>
