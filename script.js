document.addEventListener("DOMContentLoaded", function (event) {
    const btn = document.getElementById('generate');
    const actionsCheckbox = document.querySelector('#actions');
    const expandActions = document.querySelector('#expandActions');


    btn.addEventListener('click', event => {
        event.preventDefault();
        const token = document.getElementById('token').value;
        const id = document.getElementById('id').value;
        const createdDateSince = document.getElementById('createdDateSince').value;
        const createdDateUntil = document.getElementById('createdDateUntil').value;
        const selectOptions = document.querySelectorAll('#selects input[type=checkbox]:checked');
        const expandOptions = document.querySelectorAll('#expands input[type=checkbox]:checked');

        const baseUrl = "https://api.movidesk.com/public/v1/tickets";
        const params = [];
        const selectSelectedOptions = [];
        const expandSelectedOptions = [];
        const filtersParams = [];

        if (id) {
            params.push(`id=${id}`);
        }

        if (createdDateSince && createdDateUntil) {
            filtersParams.push(`createdDate gt ${createdDateSince} and createdDate lt ${createdDateUntil}`);
        } else if (createdDateSince) {
            filtersParams.push(`createdDate eq ${createdDateSince}`);
        }

        selectOptions.forEach((checkbox) => {
            if (checkbox.checked) {
                const value = checkbox.value;
                selectSelectedOptions.push(value);
            }
        })

        expandOptions.forEach((checkbox) => {
            if (checkbox.checked) {
                const value = checkbox.value;
                expandSelectedOptions.push(value);
            }
        })

        if (selectSelectedOptions.length > 0) {
            params.push(`$select=${selectSelectedOptions.join(',')}`);
        }

        if (expandSelectedOptions.length > 0) {
            params.push(`$expand=${expandSelectedOptions.join(',')}`);
        }

        if ((createdDateSince && createdDateUntil) || createdDateSince) {
            params.push(`$filter=${filtersParams.join(' and ')}`);
        }

        const queryString = params.join('&');
        const url = `${baseUrl}?token=${token}&${queryString}`;
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<p><strong>URL Gerada:</strong> ${url}</p>`;
    })

    actionsCheckbox.addEventListener('change', function () {
        console.log('rodou');
        if (actionsCheckbox.checked) {
            expandActions.classList.remove('hidden');
        } else {
            expandActions.classList.add('hidden');
        }
    })
})