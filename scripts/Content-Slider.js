const projects = document.querySelectorAll('.content-project');


projects.forEach((project) => {
    const slider = project.querySelector('.content-slider');
    const images = slider.querySelectorAll('img');
    let currentImage = 0;

    /* when clicking on image */
    images.forEach((image, index) => {
    image.addEventListener('click', () => {showNextImage();});
    });

    function showNextImage()
    {
        nextImg = (currentImage + 1)%images.length;
        images[nextImg].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        currentImage = nextImg; 
    }
});


