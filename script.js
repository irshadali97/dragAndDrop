document.addEventListener("DOMContentLoaded", function() {
    const sofaParts = document.querySelectorAll('.sofa-part');
    const sofa = document.getElementById('sofa');
    const mainRef = document.querySelector('.main-ref');
    let existingDivs = document.querySelectorAll('.sofa-added');

    // Create placeholder element
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.textContent = '+';

    let draggingElement;

    sofaParts.forEach(part => {
        part.addEventListener('dragstart', handleDragStart);
    });

    sofa.addEventListener('dragover', handleDragOver);
    sofa.addEventListener('drop', handleDrop);
    sofa.addEventListener('dragleave', handleDragLeave);

    function handleDragStart(e) {
        draggingElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        placeholder.classList.add('active');
        existingDivs.forEach((div, index) => {
            if (index !== existingDivs.length - 1) {
                mainRef.insertBefore(placeholder.cloneNode(true), div.nextSibling);
            }
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        placeholder.classList.add('active');
        const afterElement = getDragAfterElement(mainRef, e.clientY);
        if (afterElement == null) {
            mainRef.appendChild(placeholder);
            console.log('null')
        } else {
            mainRef.insertBefore(placeholder, afterElement);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        placeholder.classList.remove('active');
        const afterElement = getDragAfterElement(mainRef, e.clientY);
        if (afterElement == null) {
            mainRef.appendChild(draggingElement);
        } else {
            mainRef.insertBefore(draggingElement, afterElement);
        }
        placeholder.remove();
    }

    function handleDragLeave(e) {
        if (e.target === sofa) {
            placeholder.classList.remove('active');
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.main-ref > div:not(.placeholder)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
