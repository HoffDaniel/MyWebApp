const projects = document.querySelectorAll('.content-project');


projects.forEach((project) => {
    const slider = project.querySelector('.content-slider');
    const images = slider.querySelectorAll('img');
    let currentImage = 0;
    let interval;

    /* when clicking on image */
    images.forEach((image, index) => {
        image.addEventListener('click', () => {showNextImage(); stopSlide();});
        if(index == 0)
        {
            image.classList.toggle('active');
        }
        else
        {
            image.classList.toggle('inactive');
        }
        
    });
    project.addEventListener('mouseenter', startSlide);
    project.addEventListener('mouseleave', stopSlide);
    //project.addEventListener('mouseenter', stopSlide);


    function showNextImage()
    {
        images[currentImage].classList.remove('active');
        images[currentImage].classList.toggle('inactive');
        nextImg = (currentImage + 1)%images.length;
        images[nextImg].scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentImage = nextImg; 
        images[currentImage].classList.remove('inactive');
        images[currentImage].classList.toggle('active');
    }



    function startSlide()
    {
        interval= setInterval(showNextImage,3000);
    }

    function stopSlide()
    {
        clearInterval(interval);
    }
    
});



/*sliders.forEach((slider, index) =>{
    let interval ={
        id: 1
    };
    let Image = {
        current: 0
    };
    const images = slider.querySelectorAll('img');
    images.forEach((image, index) => {
        image.addEventListener('click', () => showNextImage(Image));
    });
    slider.addEventListener('mouseenter', startSlide(interval));
    slider.addEventListener('mouseleave', stopSlide(interval));
});*/

