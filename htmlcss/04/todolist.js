const addlist = () => {
    const select = document.getElementById('list');
    const input = document.getElementById('input');
    const text = input.value;
    if(text === ''){
        alert('cannot be empty');
        return;
    }
    const newlist = document.createElement('option');
    newlist.innerText = text;
    newlist.value = text;
    select.add(newlist)
    alert('added');
};
const deletelist = () => {
    const select = document.getElementById('list');
    const check = confirm('are you sure to delete?');
    if(!check){
        alert('cancelled');
        return;
    }
    select.remove(select.selectedIndex);
};
const addbutton = document.getElementById('add-button');
addbutton.addEventListener('click', addlist);
const deletebutton = document.getElementById('delete-button');
deletebutton.addEventListener('click', deletelist)


const form = document.getElementById('input-wrapper');
form.addEventListener('submit', (e) =>{
    e.preventDefault();
});