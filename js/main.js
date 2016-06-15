$(document).ready(function() {

  $.getJSON('data/chat.json', function(data) {
        $.each( data, function( key, value ) {

          $( '<div class="persona" id="contacto_'+value.id+'"><div class="foto"><img src="'+value.img+'" class="img-circle" width="50" ></div><div class="detalle-contacto"><div class="nombre-contacto">'+value.user+'</div><div class="mensaje-contacto">'+value.text+'</div></div><div class="hora-chat">'+value.time+'</div></div>' ).appendTo( "#contactos" );
        });
    });
    $(document).on('mouseenter', ".persona", function() { 
         $(this).addClass('hover');
    }).on('mouseleave', ".persona", function() { 
          $(this).removeClass('hover');
    });

    $("#enviado").click(function (){
      if($("#mensaje").val() != ''){
         

        enviarChat($("#id-open").val(), $("#mensaje").val());
      }
    });
    $(document).on('click', ".persona", function (){
      $(".persona").removeClass('clicked');
      $(this).addClass('clicked');
      $("#chat").css('background', 'url(image/fondo_chat.png)');
      $("#chat").css('background-color', '#eee');
      
      $("#detalle-chat-online").show();
      $("#envia").show();
      $("#mensajes").show();
      $("#mensaje").val('');
      var id_full = $(this).attr('id');
      var partes = id_full.split('_');
      var id = partes[1] - 1;
      var id_parse = partes[1];
      loadMensajes(id_parse);     
      $("#id-open").val(id_parse);
      $.getJSON('data/chat.json', function(data) {
        var contacto = data[id];

        $("#online-nombre").html(contacto.user);
        $("#foto-change").attr('src', contacto.img);
      })

      
    });


});
var db = new PouchDB('whatsapp');


function enviarChat(id, mensaje){
  var d = new Date(); 
  var time = d.getHours()+':'+d.getMinutes();

   var todo = {
      _id: new Date().toISOString(),
      user: id,
      mensaje: mensaje,
      origen: 0,
      hora: time
    };
    db.put(todo, function callback(err, result) {
      if (!err) {
        console.log('Successfully posted!');
      }
    });
  $.getJSON('data/preguntas.json', function(data) {
    $.each( data, function( key, value ) {
      if(value.preguntar = mensaje){
        var todo = {
          _id: new Date().toISOString(),
          user: id,
          mensaje: value.respuesta,
          origen: 1,
          hora: time
        };
        db.put(todo, function callback(err, result) {
          if (!err) {
            console.log('Successfully posted!');
          }
        });
      }
    })
  });
  $("#mensaje").val('');

  loadMensajes(id);
}

function loadMensajes(usuario){
  db.find({
    selector: {user: usuario}
   }).then(function (result) {
      var docs = result.docs;
      $.each( docs, function( key, value ) {

        if(value.origen == 0){
         
          $( "<div class='msg'><div class='mio'>"+value.mensaje+" <br><div class='time'>"+value.hora+"</div></div></div>" ).appendTo( "#mensajes" );

        }else {
          $( "<div class='msg'><div class='otro'>"+value.mensaje+" <br><div class='time'>"+value.hora+"</div></div></div>" ).appendTo( "#mensajes" );
        }
      });
  });

   $('#mensajes').scrollTop($('#mensajes').prop("scrollHeight"));
}

