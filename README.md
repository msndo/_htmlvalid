#W3Cバリデータに送る

##概要
W3Cのチェッカーを利用したHTML文法バリデーションを行います。複数HTMLの連続バリデーション実行も可能です。デフォルト設定ではサーバ上のWebサイト上、_htmlvalid/ を設置したディレクトリ配下を対象とします。
- 「バリデーション」を押すと該当HTML内容をW3Cのチェッカーに送信し、チェック結果を表示します。
- 「Validate All」または「連続」をクリックすると以降のHTMLを2秒ごとにチェッカーに送信します

##インストール
- このリポジトリをCLONEまたはダウンロード
- 得られた _htmlvalid/ をDOCUMENT_ROOTに配置
- _htmlvalid/index.php へブラウザアクセス

##動作環境
PHPが動作するApacheによるWebサイト配下

##対応ブラウザ
以下のブラウザ上での動作をデスクトップマシンで確認しています。
スマホ・タブレット上での確認は行っていません。

- Chrome(51.0.2以降)
- Firefox(47.0.1以降)
- Edge
- IE11

##動かない場合
- PHP5.2以上が必要

##設定
_htmlvalid/conf/conf-common.ini

- Basic認証がかかったサイトのチェックを行う場合、そのIDとパスワードを設定してください
- listMessageIgnore[] はチェッカーのエラーメッセージのうち、無視したいものを指定します

##Powered by
- [jQuery](https://jquery.com/)

##ライセンス
This software is released under the MIT License, see LICENSE.txt.

##免責・注意事項
このソフトウェアを使用したことによって生じたすべての障害・損害・不具合等に関しては、私と私の関係者および私の所属するいかなる団体・組織とも、一切の責任を負いません。各自の責任においてご使用ください。「ライセンス」について併せてお読みください

連続バリデーション作動の状況下では2秒ごとのチェックリクエスト送信を実行します。この間隔の短縮は行わないでください。また、この間隔を変更する設定項目は設けていません。
(アクセス頻度によってはW3C側で一定時間IPがブロックされる場合があります。)
