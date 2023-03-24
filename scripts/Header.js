const template = document.createElement('template');

template.innerHTML = 

"<div id='PageID'>" +
    "<div class='PageID-text'>" +
        "<br>"+ "<br>"+ 
        document.title + 
    "</div>" +
"</div>" +

"<div id='header' class='start'>" +
        
"<div class='navbar'>" +
    "<a href='#'>" +
        "<img src='/images/MOO - Copy.png' class='logo' onclick='Fun_Nav()'><br> DH" +
    "</a>" +
    
    "<div class='nav-links' style='display: block;' >"+ 
        "<a href='index2.html'>Home</a>" +
        "<a href='about.html'>About</a>" +
        "<a href='projects.html'>Projects</a>" +        
        "<div class='dropdown'>" +
            "<button class='dropbtn'>SandBox " + 
                "<i class='fa fa-caret-down'></i>" +
            "</button>" +
            "<div class='dropdown-content'>" +
                "<a href='/view/sandbox.html'>Sand1</a>" +
                "<a href='/view/sandbox2.html'>Sand2</a>" +
            "</div>" +
        "</div>" +
        "<a href='contact.html'>Contact</a>" +
    "</div>" +
"</div>"+
"</div>";

document.body.appendChild(template.content);

function Fun_Nav(){
    var dropdown_Menu = document.getElementsByClassName("nav-links")[0];
    var header = document.getElementById("header");
    header.classList.remove('start');
    //DISPLAY LINKS
    if (dropdown_Menu.style.display === "block") { 
        dropdown_Menu.style.display = "none";
        header.classList.remove('active');
        header.classList.toggle('inactive');
        
        
        //dropdown_Menu.classList.remove('active');
        header.style.width = "100%";
        
    }
    //HIDE LINKS
    else {
        dropdown_Menu.style.display = "block";
        header.classList.remove('inactive');
        header.classList.toggle('active');
        header.style.width = "100%";
        
        //dropdown_Menu.classList.toggle('active');
    }
}

/* non stringed HTML
<div id="header">
        
        <div class="navbar">
            <a href="#">
                <img src="/images/MOO - Copy.png" class="logo" onclick="Fun_Nav()"><br> Daniel HOFFMANN
            </a>
            
            <div class="nav-links" style="display: block;" >
                <a href="index2.html">Home</a>
                <a href="/index.html#about">About</a>
                <a href="#">Projects</a>
                
                <div class="dropdown">
                    <button class="dropbtn">SandBox 
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a href="/view/sandbox.html">Sand1</a>
                        <a href="/view/sandbox2.html">Sand2</a>
                    </div>
                </div>
                <a href="#">Contact</a>
            </div>
        </div>
    </div>
    */