<?php
class ConfCommon {
	function __construct() {
		$this -> listUserConf = $this -> getUserConf(getcwd() . '/conf/conf-common.ini');
		$this -> listBootParam = $this -> getBootparam();
		$this -> listStaticConf = $this -> getStaticConf();

		$this -> listConf = array_merge($this -> listUserConf, $this -> listBootParam, $this -> listStaticConf);
	}

	private function getUserConf($pathConf) {
		return parse_ini_file($pathConf);		
	}
	private function getStaticConf() {
		return array(
			'titlePage' => $this -> listUserConf['titlePage'] . (!empty($this -> listBootParam['dirFilter']) ? ' - ' . $this -> listBootParam['dirFilter'] : ''),
			'appRoot' => preg_replace('/[a-z]:\//i', '/', preg_replace('/\\\/', '/', getcwd()))
		);
	}

	private function getBootparam() {
		// ========================================================== GETパラメータ 
		$pathPrefix =  preg_replace('/[a-z]:\//i', '/', preg_replace('/\\\/', '/', $_SERVER['DOCUMENT_ROOT']));
		$dirFilter = !empty($_GET['d']) ? urldecode(htmlspecialchars($_GET['d'], ENT_QUOTES, 'utf-8')) : '';
		if(preg_match('/\.\./', $dirFilter)) { $dirFilter = ''; }

		if(empty($urlPrefix)) { $urlPrefix = (empty($_SERVER["HTTPS"]) ? "http://" : "https://") . $_SERVER["HTTP_HOST"]; }

		return array(
			'pathPrefix' => $pathPrefix,
			'dirFilter' => $dirFilter,
			'urlPrefix' => $urlPrefix
		);
	}
}
?>
