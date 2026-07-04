const $ = document

const wrapperNotes = $.querySelector('.wrapper'),
addBox = $.querySelector('.add-box'),
popupBox = $.querySelector('.popup-box'),
popupTitle = $.querySelector('.popup-title'),
popupClose = $.querySelector('header i'),
popupInput = $.querySelector('input'),
popupTextarea = $.querySelector('textarea'),
btnElem = $.querySelector('button')


let isUpdate = false
let updateID = null

let notes = []

// Display the modal for adding or updating a note
function showModal(notetitle = '', noteDescription = '') {

    if (isUpdate) {
        popupTitle.innerHTML = 'Update main note'
        btnElem.innerHTML = 'Update Note'
        popupInput.value = notetitle
        popupTextarea.value = noteDescription
    }  else {
        popupTitle.innerHTML = 'Add a new note'
        btnElem.innerHTML = 'Add Note'
    }

    popupInput.focus()
    popupBox.classList.add('show')

}

addBox.addEventListener('click', showModal)

btnElem.addEventListener('click', () => {

    if (isUpdate) {

        let allNote = getLocalStorageNotes()
        allNote.some((note, index) => {
            if (index === updateID) {
                note.Title = popupInput.value  
                note.Description = popupTextarea.value  
            }
        })
        setNotesInLocalStorage(allNote)
        generateNote(allNote)
        ClearInput()
        closeModal()

        isUpdate = false

    } else {

        let newNotes = {
            Title: popupInput.value,
            Description: popupTextarea.value,
            Date: getNowDate()
        }

        notes.push(newNotes)
        setNotesInLocalStorage(notes)
        closeModal()
        generateNote(notes)
        ClearInput()

    }
    
})

// Clear the input fields
function ClearInput() {

    popupInput.value = ''
    popupTextarea.value = ''

}

// Get the current date and return it as a formatted string
function getNowDate() {

    let now = new Date()

    const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

    let nowDay = now.getDay()
    let nowMonth = now.getMonth()
    let nowYear = now.getFullYear()

    return `${months[nowMonth]} ${nowDay}, ${nowYear}`

}

// Generate and display all notes
function generateNote(notes) {

    $.querySelectorAll('.note').forEach(note => note.remove())

    notes.forEach((note, index) => {
        wrapperNotes.insertAdjacentHTML('beforeend', 
            `<li class="note">
                <div class="details">
                  <p>${note.Title}</p>
                  <span>${note.Description}</span>
                </div>
                <div class="bottom-content">
                  <span>${note.Date}</span>
                  <div class="settings">
                    <i class="uil uil-ellipsis-h" Onclick="showSettings(this)"></i>
                    <ul class="menu">
                      <li Onclick="settingsEdit(${index}, '${note.Title}', '${note.Description}')">
                        <i class="uil uil-pen"></i>Edit
                      </li>
                      <li Onclick="settingsDelete(${index})">
                        <i class="uil uil-trash"></i>Delete
                      </li>
                    </ul>
                  </div>
                </div>
            </li>`)
    });

}

// Show or hide the settings menu for a note
function showSettings(el) {

    el.parentElement.classList.add('show')

    $.addEventListener('click', e => {

        if (e.target.tagName !== 'I' || e.target != le) {
            el.parentElement.classList.remove('show')
        }

    })

}

// Open the selected note in edit mode
function settingsEdit(noteID ,notetitle, noteDescription) {
    // console.log(noteID ,titleID, descriptionID);
    
    isUpdate = true
    showModal(notetitle, noteDescription)
    updateID = noteID

}

// Delete the selected note after confirmation
function settingsDelete(noteIndex) {

    let deleted = confirm('Are you sure to delete note?')

    if (deleted) {
        let newNote = getLocalStorageNotes()

        newNote.splice(noteIndex, 1)
        setNotesInLocalStorage(newNote)
        generateNote(newNote)
    }

}

// Retrieve all notes from Local Storage
function getLocalStorageNotes() {

    let localStorageNotes = localStorage.getItem('notes')
    
    if (localStorageNotes) {
        notes = JSON.parse(localStorageNotes)
    } else {
        notes = []
    }
    
    return notes
}

// Save all notes to Local Storage
function setNotesInLocalStorage(notes) {

    localStorage.setItem('notes', JSON.stringify(notes))

}

// Close the modal
function closeModal() {
    
    popupBox.classList.remove('show')

}

popupClose.addEventListener('click', closeModal)

window.addEventListener('load', () => {

    let notes = getLocalStorageNotes()
    generateNote(notes)

})

window.addEventListener('keyup', e  => {

    if (e.key == 'Escape') {
        closeModal()
    }

})