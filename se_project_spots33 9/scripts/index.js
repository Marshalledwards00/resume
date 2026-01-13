const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  }
];


// Modal open/close logic for Spots project
const modalOpenedClass = 'modal_is-opened';

function openModal(modal) {
  if (!modal) return;
  // save the element that opened the modal so focus can be restored
  modal.__opener = document.activeElement;
  modal.classList.add(modalOpenedClass);
  // focus first focusable element inside modal
  setTimeout(function () {
    focusFirstDescendant(modal);
    trapFocus(modal);
  }, 0);
}

function closeModal(modal) {
  if (!modal) return;
  removeTrap(modal);
  modal.classList.remove(modalOpenedClass);
  // restore focus to opener
  try {
    if (modal.__opener && typeof modal.__opener.focus === 'function') modal.__opener.focus();
  } catch (e) {
    // ignore
  }
}

// Focus helpers
function focusableElements(container) {
  return container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
}

function focusFirstDescendant(container) {
  const elems = focusableElements(container);
  if (elems.length) elems[0].focus();
}

// Focus trap implementation (simple)
function trapFocus(modal) {
  if (!modal) return;
  function handleKey(e) {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(focusableElements(modal)).filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal.__trapHandler = handleKey;
  modal.addEventListener('keydown', handleKey);
}

function removeTrap(modal) {
  if (!modal || !modal.__trapHandler) return;
  modal.removeEventListener('keydown', modal.__trapHandler);
  delete modal.__trapHandler;
}

// --- Edit Profile modal elements ---
const editProfileBtn = document.querySelector('.profile__edit-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileClose = editProfileModal ? editProfileModal.querySelector('.modal__close') : null;
const editProfileForm = editProfileModal ? editProfileModal.querySelector('.modal__form') : null;
const editProfileNameInput = editProfileForm ? editProfileForm.querySelector('#profile-name') : null;
const editProfileAboutInput = editProfileForm ? editProfileForm.querySelector('#profile-description') : null;
const profileNameEl = document.querySelector('.profile__name');
const profileDescriptionEl = document.querySelector('.profile__description');

// --- New Post modal elements ---
const newPostBtn = document.querySelector('.profile__add-btn');
const newPostModal = document.getElementById('new-post-modal');
const newPostClose = newPostModal ? newPostModal.querySelector('.modal__close') : null;
const newPostForm = newPostModal ? newPostModal.querySelector('.modal__form') : null;
const newPostTitleInput = newPostForm ? newPostForm.querySelector('#post-title') : null;
const newPostImageInput = newPostForm ? newPostForm.querySelector('#post-image') : null;

// Card template and container
const cardTemplate = document.getElementById('card-template') ? document.getElementById('card-template').content : null;
const cardsList = document.querySelector('.cards__list');

// Image preview modal elements
const imagePreviewModal = document.getElementById('image-preview-modal');
const previewImage = imagePreviewModal ? imagePreviewModal.querySelector('.modal__image') : null;
const previewCaption = imagePreviewModal ? imagePreviewModal.querySelector('.modal__caption') : null;
const imagePreviewClose = imagePreviewModal ? imagePreviewModal.querySelector('.modal__close') : null;

// Wire Edit Profile open
if (editProfileBtn && editProfileModal) {
  editProfileBtn.addEventListener('click', function () {
    // Pre-fill inputs with current profile text
    if (editProfileNameInput && profileNameEl) editProfileNameInput.value = profileNameEl.textContent.trim();
    if (editProfileAboutInput && profileDescriptionEl) editProfileAboutInput.value = profileDescriptionEl.textContent.trim();
    openModal(editProfileModal);
  });
}

// Close when clicking the overlay (outside the container)
if (editProfileModal) {
  editProfileModal.addEventListener('click', function (evt) {
    if (evt.target === editProfileModal) closeModal(editProfileModal);
  });
}

// Wire Edit Profile close (close button)
if (editProfileClose) {
  editProfileClose.addEventListener('click', function () {
    closeModal(editProfileModal);
  });
}

// Edit Profile form submit
if (editProfileForm && profileNameEl && profileDescriptionEl) {
  editProfileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (editProfileNameInput) profileNameEl.textContent = editProfileNameInput.value;
    if (editProfileAboutInput) profileDescriptionEl.textContent = editProfileAboutInput.value;
    closeModal(editProfileModal);
  });
}

// Wire New Post open
if (newPostBtn && newPostModal) {
  newPostBtn.addEventListener('click', function () {
    openModal(newPostModal);
  });
}

if (newPostModal) {
  newPostModal.addEventListener('click', function (evt) {
    if (evt.target === newPostModal) closeModal(newPostModal);
  });
}

// Wire New Post close (close button)
if (newPostClose) {
  newPostClose.addEventListener('click', function () {
    closeModal(newPostModal);
  });
}

// New Post form submit (log values)
// Create card element from template
function getCardElement(data) {
  if (!cardTemplate) return null;
  const fragment = cardTemplate.cloneNode(true);
  const cardElement = fragment.querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  // assign data
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // like button
  const likeButton = cardElement.querySelector('.card__like-button');
  if (likeButton) {
    likeButton.addEventListener('click', function () {
      likeButton.classList.toggle('card__like-button_active');
    });
  }

  // delete button (overlayed in the image wrapper)
  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (deleteButton) {
    deleteButton.addEventListener('click', function () {
      cardElement.remove();
    });
  }

  // preview on image click + keyboard activation
  if (cardImage && imagePreviewModal && previewImage && previewCaption) {
    // make image focusable for keyboard users
    cardImage.tabIndex = 0;
    const openPreview = function () {
      previewImage.src = data.link;
      previewImage.alt = data.name;
      previewCaption.textContent = data.name;
      openModal(imagePreviewModal);
    };
    cardImage.addEventListener('click', openPreview);
    cardImage.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        openPreview();
      }
    });
  }

  return cardElement;
}

// Render initial cards
if (Array.isArray(initialCards) && cardsList) {
  initialCards.forEach(function (item) {
    const el = getCardElement(item);
    if (el) cardsList.append(el);
  });
}

// New Post form submit: create a new card and prepend (use cached inputs)
if (newPostForm) {
  newPostForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const title = newPostTitleInput ? newPostTitleInput.value.trim() : '';
    const image = newPostImageInput ? newPostImageInput.value.trim() : '';
    if (title && image) {
      const newCard = getCardElement({ name: title, link: image });
      if (newCard && cardsList) cardsList.prepend(newCard);
      newPostForm.reset();
      closeModal(newPostModal);
    }
  });
}

// Optional: close modals on Escape key
document.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape') {
    closeModal(editProfileModal);
    closeModal(newPostModal);
  }
});

// Image preview modal close wiring
if (imagePreviewModal) {
  if (imagePreviewClose) {
    imagePreviewClose.addEventListener('click', function () {
      closeModal(imagePreviewModal);
    });
  }
  imagePreviewModal.addEventListener('click', function (evt) {
    if (evt.target === imagePreviewModal) closeModal(imagePreviewModal);
  });
}

// Log the names of the initial cards to verify the array
// (initialCards are rendered into the DOM above)
