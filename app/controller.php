<?php
// ========================================================== 除外条件があればこの関数を編集 
function listFile($dir) {
	$dir = $dir;

	if(empty($dir) || !file_exists($dir)) { return false; }

	$fileSearch = new ListFile;
	$listFileSrc = $fileSearch -> getFileListLinear($dir);

	$listFile = array();
	foreach($listFileSrc as $fileSrc) {
        // 除外条件集
		if(! preg_match('/\.html$/', $fileSrc)) { continue; }
		if(! preg_match('/<!DOCTYPE/i', file_get_contents($fileSrc))) { continue; }
		if(preg_match('/\/app\//', $fileSrc)) { continue; }
		if(preg_match('/\/_metaedit\//', $fileSrc)) { continue; }
		if(preg_match('/\/_imgedit\//', $fileSrc)) { continue; }

		array_push($listFile, $fileSrc);
	}

	return($listFile);
}
?>
