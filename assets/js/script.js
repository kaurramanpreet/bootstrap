
var pictures = {}


function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}


$(document).ready(function (){

    var background_image_h = $("#background_image").prop("naturalHeight");
    var background_image_w = $("#background_image").prop("naturalWidth");

    var w = String((background_image_h/background_image_w) * 1000);
            
    $("#background").css({"width": "1000px", "height": w + "px"})
    $("#element1").css({"width": "1000px", "height": w + "px"})

    var start = parseInt($('#start').val());
    for(var i=0; i<start; i++){
        var left = $("#picture" + i + "_image").css("left");
        var top = $("#picture" + i + "_image").css("top");
        var image_name = $("#picture" + i + "_name").val();
        var image_width = $("#picture" + i + "_image_width").val();
        var image_height = $("#picture" + i + "_image_height").val();
        var image_id = "picture" + i;
        pictures[image_id] =  {};
        pictures[image_id]['left'] = $("#picture" + i + "_left").val();
        pictures[image_id]['top'] = $("#picture" + i + "_top").val();
        pictures[image_id]['image_name'] = image_name;
        pictures[image_id]['image_height'] = image_height;
        pictures[image_id]['image_width'] = image_width;
        $("#picture" + i).css("left", String(parseFloat(left) * 1000) + "px");
        $("#picture" + i).css("top", String(parseFloat(top) * parseFloat(w)) + "px");
        $("#picture" + i + "_image").css("height", String(parseFloat(image_height) * parseFloat(w)) + "px");
        $("#picture" + i + "_image").css("width", String(parseFloat(image_width) * 1000) + "px");
    }
    
    var start = parseInt($('#no_of_texts').val());
    for(var i=0; i<start; i++){
        var left = $("#text" + i).css("left");
        var top = $("#text" + i).css("top");
        var image_id = "text" + i;
        pictures[image_id] =  {};
        pictures[image_id]['left'] = $("#text" + i + "_left").val();
        pictures[image_id]['top'] = $("#text" + i + "_top").val();
        pictures[image_id]['text_height'] = $("#text" + i + "_text_height").val();
        pictures[image_id]['text_width'] = $("#text" + i + "_text_width").val();
        pictures[image_id]['text'] = $("#scene_text" + i).val();
        $("#text" + i).css("left", String(parseFloat(left) * 1000) + "px");
        $("#text" + i).css("top", String(parseFloat(top) * parseFloat(w)) + "px");
    }

    $('.item').draggable({
        
        start: function(event, ui){
            var image_id = $(this).attr('id');
            pictures[image_id] = {}
        },

        stop: function(event, ui) {

            var image_id = $(this).attr('id');

            if (isEmptyObject(pictures[image_id])){
                delete pictures[image_id];
            }

        }


    });


    $(".resizable").resizable();


    $("#element1").droppable({
        accept: ".item",

        drop: function( event, ui ) {

            var background_height = parseFloat($("#element1").css("height"));
            var background_width = parseFloat($("#element1").css("width"));

            var newPosX = String(parseFloat((ui.offset.left - $(this).offset().left))/background_width);
            var newPosY = String(parseFloat((ui.offset.top - $(this).offset().top))/background_height);
            var image_id = ui.draggable.attr("id");
            var image_height = String(parseFloat((ui.draggable.height()))/background_height);
            var image_width = String(parseFloat((ui.draggable.width()))/background_width);
            
            pictures[image_id]['left'] = newPosX;
            pictures[image_id]['top'] = newPosY;
            
            if (image_id.startsWith('text')){
                pictures[image_id]['text'] = $("#" + image_id + ".item").find("input").val();
                pictures[image_id]['text_height'] = image_height;
                pictures[image_id]['text_width'] = image_width;
            }
            else{
                var image_src = $("#" + image_id + "_image").attr("src");
                var a = image_src.split('/');
                image_height = String($("#" + image_id + "_image").height()/background_height);
                image_width = String($("#" + image_id + "_image").width()/background_width);
                pictures[image_id]['image_name'] = a[a.length - 1];
                pictures[image_id]['image_height'] = image_height;
                pictures[image_id]['image_width'] = image_width;
            }

        }
    });
});


function saveScene(){

    var text_list = [];
    var picture_list = [];

    for(picture in pictures){
        if(picture.startsWith('text')){
            pictures[picture]['text'] = $("#" + picture + ".item").find("input").val();
            text_list.push(pictures[picture]);
        }
        else{
            picture_list.push(pictures[picture]);
        }
    }

    var a = $("#background_image").attr('src').split('/');
    var background_image = a[a.length - 1];

    var no_of_pictures = picture_list.length;
    var no_of_texts = text_list.length;

    var lesson_id = $('#lesson_id').val();
    var scene_id = $('#scene_id').val();
    
    var description = $("#description").val();

    url = "/add_custom_scene?lesson_id=" + String(lesson_id);

    if (scene_id != "None"){
        url = url + "&scene_id=" + String(scene_id);
    }

    $.post(url,
        {
            'background_image': background_image,
            'picture_list': picture_list,
            'text_list': text_list,
            'no_of_pictures': no_of_pictures,
            'no_of_texts': no_of_texts,
            'description': description
        },
        function(data, status){
            if(status == 'success'){
                window.location.replace("/lesson_edit?lesson_id=" + String(lesson_id));
            }
            else{
                alert("Status: " + status);
            }
        }
    );
    
}


function changeBackground(event){
    var background_id = event.target.id;
    var a = $("#" + background_id).attr("src").split('/');
    var background_name = a[a.length - 1];

    $("#background_image").attr('src', "/assets/img/backgrounds/" + background_name);
    $("#background").css('background-image', "url('/assets/img/backgrounds/" + background_name +"')");

    var background_image_h = $("#background_image").prop("naturalHeight");
    var background_image_w = $("#background_image").prop("naturalWidth");

    var w = String((background_image_h/background_image_w) * 1000);
            
    $("#background").css({"width": "1000px", "height": w + "px"})
    $("#element1").css({"width": "1000px", "height": w + "px"})
}