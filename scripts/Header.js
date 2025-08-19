const template = document.createElement('template');

template.innerHTML = 

/*"<div id='PageID'>" +
    "<div class='PageID-text'>" +
        document.title + 
    "</div>" +
"</div>" + 
☰
*/
"<div id='header' class='start'>" +
        
"<div class='navbar'>" +
 
    "<a style='display:flex; gap: 10px;' onclick='Fun_Nav()' role='button' tabindex='0'> " +
        "<span class='icon'>&#x2630;</span>" +
        "<img src='/resources/Logo/Logo_16.png' class='logo'> " +
    "</a>" +
    
    "<div class='nav-links' style='display: block;' >"+ 
        "<a href='/index.html#intro'>Home</a>" +
        "<a href='/index.html#about-me'>About</a>" +
        "<a href='/index.html#projects'>Projects </a>" +        
        "<div class='dropdown'>" + 
            "<button class='dropbtn' onclick=\"location.href='/index.html#sandbox'\">SandBox</button>" +
            "<div class='dropdown-content'>" +
                "<a href='/view/sandbox.html'>Sand1</a>" +
                "<a href='/view/sandbox2.html'>Sand2</a>" +
                "<a href='/view/sandbox_Astar.html'>A*</a>" +
                "<a href='/view/sandbox_Golden.html'>Golden Spiral</a>"  +
            "</div>" +
        "</div>" +
        "<a href='/index.html#contact'>Contact</a>" +
    "</div>" +
"</div>"+
"</div>";

//document.body.appendChild(template.content);
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nav-slider').appendChild(template.content);
});

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