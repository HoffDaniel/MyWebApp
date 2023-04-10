const projects = document.querySelectorAll('.content-project');


projects.forEach((project,index) => {
    const slider = project.querySelector('.content-slider');

    const images = slider.querySelectorAll('img');
    
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
    project_canvas.style.display = "none";
    project_p.style.display = "none";
    project_title.style.scale = "1";
    
});

function hideContentProject(event) {
    var project_canvas = event.currentTarget.parentNode.querySelector('.content-project-canvas');
    var project_p = event.currentTarget.parentNode.querySelector('.content-project p');
    if(project_canvas.style.display == "none"){
        project_canvas.style.display = "grid";
        project_p.style.display = "grid";
        event.currentTarget.style.scale = "1";
    }
    else{
        project_canvas.style.display = "none";
        project_p.style.display = "none";
        
        event.currentTarget.style.scale = "1";
    }
    
  }





