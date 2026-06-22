// Video Modal
document.addEventListener('DOMContentLoaded', function() {
    const videoBtn = document.getElementById('videoBtn');
    const videoModal = document.getElementById('videoModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const videoFrame = document.getElementById('videoFrame');

    if (!videoBtn || !videoModal) return;

    // Open modal
    function openModal(e) {
        e.preventDefault();
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        stopVideo();
    }

    // Stop video
    function stopVideo() {
        const src = videoFrame.src;
        videoFrame.src = '';
        videoFrame.src = src;
    }

    // Event listeners
    videoBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });
});
