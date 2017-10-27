<?php

require_once ('codebird.php');

//Twitter OAuth Settings, enter your settings here:
$CONSUMER_KEY = 'yWcM4QnF3A8trD3FjA3l5PdZ3';
$CONSUMER_SECRET = 'cFSRqr96CbiShSizjBzMgoJczacEQV1KvVZz2FSENAg3axhzbo';
$ACCESS_TOKEN = '3229818575-85sKXHV6yaJo5POiNroAcFvGCL4kpvaK27kGwL4';
$ACCESS_TOKEN_SECRET = 't53twyY1YzY0Q8gjqe8Ex18SFLWiJDSJ1iKzTA31o99eN';

//Get authenticated
Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);




 ?>
