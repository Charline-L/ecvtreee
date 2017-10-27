<?php

include ('authTwitter.php');
include ('connectMySQL.php');


if (isset($_GET['requete'])){
  $requete = $_GET['requete'];

  // cherche un tweet
  if($requete === 'find'){
    //récupère
    $hashtag = $_POST['hashtag'];
    $nombre = $_POST['nombre'];
    $api = $_POST['api'];

    // génère les paramètres de filtre API
    $params = array(
    	'screen_name' => $hashtag,
    	'q' => $hashtag,
    	'count' => $nombre
    );

    //appel
    $data = (array) $cb->$api($params);

    //envoie le résultat
    echo json_encode($data);
  }

  // ajoute dans la bdd
  if ($requete === 'add'){
    // récupère
    $message = $_POST['message'];
    $couleur = $_POST['couleur'];
    $id = $_POST['id'];
    $utilisateur = $_POST['utilisateur'];
    // requete bdd
    $rq_ajout="INSERT INTO feuilles (f_id, f_couleur, f_message) VALUES ('$id', '$couleur', '$message')";
    $rs_ajout=$connect->query($rq_ajout);

    if ($rs_ajout === TRUE){
      $data= ['etat' => 'ok', 'id' => $id, 'utilisateur' => $utilisateur];
      echo json_encode($data);
    }
    else {
      $data= ['etat' => 'erreur', 'utilisateur' => $utilisateur];
      echo json_encode($data);
    }
  }

  if ($requete === 'old'){

    // requete bdd
    $rq_old= "SELECT * FROM feuilles";
    $rs_old= $connect->query($rq_old);

    if ( $rs_old->num_rows > 0 ) {
      $ids= [];
      while($row_old = $rs_old->fetch_assoc()){
        // récupère les id
        array_push($ids, $row_old['f_id']);
      }
      $data= ['etat' => 'ok', 'ids' => $ids];
      echo json_encode($data);
    }
    else if ( $rs_old->num_rows === 0 ){
      $data= ['etat' => 'vide'];
      echo json_encode($data);
    }
    else {
      $data= ['etat' => 'erreur connexion bdd'];
      echo json_encode($data);
    }
  }


  if ($requete === 'createTree'){

    // requete bdd
    $rq_old= "SELECT * FROM feuilles";
    $rs_old= $connect->query($rq_old);

    if ( $rs_old->num_rows > 0 ) {
      $ids= [];
      $couleurs= [];
      $messages= [];
      while($row_old = $rs_old->fetch_assoc()){
        // récupère les id
        array_push($ids, $row_old['f_id']);
        array_push($couleurs, $row_old['f_couleur']);
        array_push($messages, $row_old['f_message']);
      }
      $data= ['etat' => 'ok', 'ids' => $ids, 'couleurs' => $couleurs, 'messages' => $messages];
      echo json_encode($data);
    }
    else if ( $rs_old->num_rows === 0 ){
      $data= ['etat' => 'vide'];
      echo json_encode($data);
    }
    else {
      $data= ['etat' => 'erreur connexion bdd'];
      echo json_encode($data);
    }
  }


}


 ?>
