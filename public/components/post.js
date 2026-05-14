export const Post = (data, userName) => {
    return `
    <div class="w-5/6 bg-transparent border-2 border-gray-900 rounded-xl p-5 my-5">
        <div class="grid grid-cols-3">
        <div class="col-span-3">
            <p class="text-sm font-semibold text-rose-500 mb-3">${data.author}</p>
        </div>
        <div class="col-span-3 md:col-span-2">
            <p class="text-sm font-semibold">${data.text}</p>
        </div>
        <div class="col-span-3 md:col-span-1">
            <div class="flex justify-start mt-3 md:justify-end md:mt-0">
            ${
                data.author === userName ? 
                `<button class="bg-gray-700 p-2 rounded-3xl hover:bg-gray-800" name="btnDelete" data-id=${data.id}>
                <img src="../../assets/trash.svg" width="25" height="25" name="btnDelete" data-id=${data.id}>
                </button>`
                : 
                `<button class="bg-gray-700 p-2 rounded-3xl hover:bg-gray-800" name="btnLike" data-id=${data.id}>
                <img src="../../assets/heart.svg" width="25" height="25" name="btnLike" data-id=${data.id}>
                ${data.likes}
                </button> 
                <button class="bg-gray-700 p-2 ml-4 rounded-3xl hover:bg-gray-800" name="btnDislike" data-id=${data.id}>
                <img src="../../assets/dislike.svg" width="25" height="25" name="btnDislike" data-id=${data.id}>
                ${data.dislikes}
                </button>`
                
            }
            </div>
        </div>
        </div>
    </div>
    `;
}