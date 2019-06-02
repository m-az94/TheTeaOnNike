//-------------------------------------- Index.Handlebars
// 1. Add Shoes/Articles 
$("#add-shoes").on("click", event => {
    event.preventDefault();
    alert("20 Shoes were Added!");

    $.getJSON("/articles", data =>{
        console.log("JSON loading");
        for (let i=0; i < 21; i++){
            const image = $("<img>").attr("src",data[i].image).attr("class","product-image");
            const name = $("<p>").attr("class","product-name").text(data[i].name);
            const price = $("<p>").attr("class","product-price").text(data[i].price);
            const link = $("<a>").attr("class","product-price").attr("href",data[i].link).text("Click Here To Purchase");
            const save = $("<button>").attr("class", "save-btn").attr("data-id", data[i]._id).text("Save Shoe");
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

// 2. Save Shoe 
$(document).on("click",".save-btn", event => {
    event.preventDefault();
    //console.log("saved btn clicked");
    const thisId = event.target.dataset.id;
    //console.log(this);
    //console.log(event);
    //console.log(thisId);
    $.ajax({
        method: "PUT",
        url: "/saved/"+thisId
    }).then(data => {
        console.log("article has been added");
        console.log(data);})
    .catch(err => console.log(err));
});

//-------------------------------------- Saved.Handlebars

// 1. 
$.getJSON("/saves", data =>{
    $(".save-landing").append("<p>Hello!</p>");
    console.log("getting saves JSON data");
    //console.log(data);
    for (let i=0; i<data.length; i++){
        const image = $("<img>").attr("src",data[i].image).attr("class","product-image");
        const name = $("<p>").attr("class","product-name").text(data[i].name);
        const price = $("<p>").attr("class","product-price").text(data[i].price);
        const link = $("<a>").attr("class","product-price").attr("href",data[i].link).text("Click Here To Purchase");
        const save = $("<button>").attr("class", "delete-btn").attr("data-id", data[i]._id).text("Delete");
        const note = $("<button>").attr("class", "note-btn").attr("data-id",data[i]._id).text("View Note");
        const landing = $("<div>").attr("id", data[i]._id);

        $(".save-landing").append(image);
        $(".save-landing").append(name);
        $(".save-landing").append(price);
        $(".save-landing").append(link);
        $(".save-landing").append("<br>");
        $(".save-landing").append(save);
        $(".save-landing").append(note);
        $(".save-landing").append("<br><br>");
        $(".save-landing").append(landing);
    }
});

// 2. Unsave Shoe 
$(document).on("click",".delete-btn", event => {
    event.preventDefault();
    console.log(event);
    const thisId = event.target.dataset.id;
    console.log(thisId);
    $.ajax({
        method: "PUT",
        url: "/unsaved/"+thisId
    }).then(data => {
        console.log("article has been added");
        console.log(data);
        location.reload();
    }).catch(err => console.log(err));
});

// 3. View Notes 
$(document).on("click", ".note-btn", event =>{
    event.preventDefault()
    const thisId = event.target.dataset.id;

    // create a form for notes 
    const form = $("<form>");
    const note = $("<input>").attr("type", "text").attr("class","input-note").attr("placeholder","Enter your text here...");
    const btn = $("<button>").attr("type", "submit").attr("class","submit-btn").text("Submit").attr("data-id",thisId);

    $(form).append(note);
    $(form).append(btn);
    $("#"+thisId).append(form);
    
    console.log(thisId);
    console.log("ajax call:")
    $.ajax({
        method: "GET",
        url: "/pop-articles/"+thisId
    }).then(data => {
        console.log(data);
        let x = $("<a>").attr("class", "note").text("Message: "+data.notes.body +" ");
        let btn = $("<button>").attr("class", "del-btn").attr("data-id", data.notes._id).text("Delete");
        $(x).append(btn);
        $("#"+thisId).append(x);

    }).catch(error => console.log(error));
});

// 4. Add New Notes 
$(document).on("click", ".submit-btn", event =>{
    event.preventDefault();
    //console.log(event);
    const thisId = event.target.dataset.id;
    const input = $(".input-note").val().trim();
    //console.log (thisId +" "+input);
    $.ajax({
        method:"POST",
        url: "/articles/"+thisId,
        data: {
            body: input
        }
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));
    $(".input-note").val('');
});

// 5. Delete Notes 
$(document).on("click", ".del-btn", event =>{
    event.preventDefault();
    const thisId = event.target.dataset.id;
    console.log(thisId);
    $.ajax({
        method: "DELETE",
        url: "/notes/"+thisId
    }).then(data =>{
        $(".note").empty();
        console.log(data);
    }).catch(err => console.log(err));

});