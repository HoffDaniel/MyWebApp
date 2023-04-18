const projects = document.querySelectorAll('.content-project');


projects.forEach((project,index) => {
    const slider = project.querySelector('.content-slider');

    const images = slider.querySelectorAll('img');
    images[0].style.opacity = 1;
    
    let currentImage = 0;
    
    
    

    /* when clicking on image */
    images.forEach((image) => {
    image.addEventListener('click', () => {showNextImage();});
    });
    function showNextImage()
    {
        
        images[currentImage].style.opacity = 1;        
       
        //images[nextImg].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            //content-project(even) -> slide right
            nextImg = (currentImage + 1) % images.length;
            const scrollAmount = images[nextImg].offsetLeft - images[currentImage].offsetLeft;
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            //dotsContainer.style.left = `${parseInt(dotsContainer.style.left) + scrollAmount}px`;
       
          
        //images[nextImg].scrollIntoView({ behavior: 'smooth', block: 'nearest'});
        images[currentImage].style.opacity = 0.42;
        images[nextImg].style.opacity = 1;
        currentImage = nextImg; 
    };

    var project_title = project.querySelector('.content-project-title');
    var project_canvas = project.querySelector('.content-project-canvas');
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





