const projects = document.querySelectorAll('.content-project');


projects.forEach((project,index) => {
    const project_canvas = project.querySelector('.content-project-canvas');
    const slider = project.querySelector('.content-slider');
    const images = slider.querySelectorAll('img');

    var newDots = document.createElement('span');
    newDots.classList.add('dots');
    project_canvas.appendChild(newDots);
    
    let currentImage = 0;
    
    

    /* when clicking on image */
    images.forEach((image, index) => {
        //Add event Listener
        image.addEventListener('click', () => {showNextImage();});
        
        //Add Dots under canvas
        var newDot = document.createElement('span');
        newDot.classList.add('dot');
        if(index===0){ newDot.classList.add('active');}
        newDot.addEventListener('click', () => showThisImage(index))
        newDots.appendChild(newDot);


    });

    function showThisImage(index)
    {
        /*
        -Get Index of the next image
        -calculate distance difference (offset?)
        -scroll by the calculated amount
        -make images fade out/in
        -make active image correspond to active dot
        -update current Image value (its an index)
        */
        nextImg = index;
        const scrollAmount = images[nextImg].offsetLeft - images[currentImage].offsetLeft;
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        images[currentImage].style.opacity = 0.42;
        images[nextImg].style.opacity = 1;
        var allDots = newDots.querySelectorAll('.dot')
        allDots[currentImage].classList.remove('active');
        allDots[nextImg].classList.toggle('active');
        currentImage = nextImg; 
    }

    function showNextImage()
    {

        //content-project(even) -> slide right
        nextImg = (currentImage + 1) % images.length;

        const scrollAmount = images[nextImg].offsetLeft - images[currentImage].offsetLeft;
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        images[currentImage].style.opacity = 0.42;
        images[nextImg].style.opacity = 1;
        var allDots = newDots.querySelectorAll('.dot')
        allDots[currentImage].classList.remove('active');
        allDots[nextImg].classList.toggle('active');
        //canvas_dots.innerHTML = (nextImg+1) + "/" + images.length; //adding +1 cause nextImg starts index 0 ...
        currentImage = nextImg; 
    };

    var project_title = project.querySelector('.content-project-title');
    
    var project_p = project.querySelector('.content-project p');
    var content_pro_active = project.parentNode.querySelector('.content-project.active');

    content_pro_active.querySelector('.content-project-title').style.display = "grid";
    content_pro_active.querySelector('.content-project-canvas').style.display = "grid";
    
    
    
});

/*On click of content project title*/
function hideContentProject(event) {
    var content_pro = event.currentTarget.parentNode;


    var project_canvas = content_pro.querySelector('.content-project-canvas');
    var project_p = content_pro.querySelector('.content-project p');
    var content_pro_active = content_pro.parentNode.querySelector('.content-project.active');
    
    /*If True -> Active content-project-title has been clicked*/
    if(content_pro == content_pro_active){

        project_canvas.style.display = "none";
        project_p.style.display = "none";
        var next_content = content_pro_active.nextElementSibling;
        if(next_content == null)//reached the end of projects?
        {
            next_content = content_pro_active.parentNode.querySelector('.content-project');
        }
        //console.log("next content: " + next_content);
        var tmp_canvas = next_content.querySelector('.content-project-canvas');
        tmp_canvas.style.display = "grid";
        var tmp_p = next_content.querySelector('.content-project p');
        tmp_p.style.display = "grid";

        content_pro_active.classList.remove('active');        
        next_content.classList.toggle('active');

        return;
    }
    project_canvas.style.display = "grid";
    project_p.style.display = "grid";

    var tmp_canvas = content_pro_active.querySelector('.content-project-canvas');
    tmp_canvas.style.display = "none";
    var tmp_p = content_pro_active.querySelector('.content-project p');
    tmp_p.style.display = "none";
    content_pro_active.classList.remove('active');

    content_pro.classList.toggle('active');
    content_pro.scrollIntoView({behavior:'smooth'});

    
    
  }





