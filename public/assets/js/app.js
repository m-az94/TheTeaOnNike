// Add Shoes/Articles 
$("#add-shoes").on("click", event => {
    event.preventDefault();
    alert("20 Shoes were Added!");

    $.getJSON("/articles", data =>{
        console.log("JSON loading");
        for (let i=0; i < 21; i++){
            let image = $("<img>").attr("src",data[i].image).attr("class","product-image");
            let name = $("<p>").attr("class","product-name").text(data[i].name);
            let price = $("<p>").attr("class","product-price").text(data[i].price);
            let link = $("<a>").attr("class","product-price").attr("href",data[i].link).text("Click Here To Purchase");
            let save = $("<button>").attr("class", "save-btn").attr("data-id", data[i]._id).text("Save Shoe");
            //let note = $("<button>").attr("class", "note-btn").attr("data-id",data[i]._id).text("Add Note");

            $(".shoe-landing").append(image);
            $(".shoe-landing").append(name);
            $(".shoe-landing").append(price);
            $(".shoe-landing").append(link);
            $(".shoe-landing").append("<br>");
            $(".shoe-landing").append(save);
            //$(".shoe-landing").append(note);
            $(".shoe-landing").append("<br><br>");
           //$(".shoe-landing").append("<p>Testing</p>");
        }
    });
});

$(document).on("click",".save-btn", event => {
    event.preventDefault();
    console.log("saved btn clicked");
    let thisId = event.target.dataset.id;
    //console.log(this);
    console.log(event);
    console.log(thisId);
    $.ajax({
        method: "PUT",
        url: "/articlessaved/"+thisId,
        data: {
            saved: true
        }
    }).then(function (data) {
        console.log("article has been added");
        console.log(data);
        })
    .catch(function(err){console.log(err)});
});