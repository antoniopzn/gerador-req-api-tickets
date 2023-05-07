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
        const expandOptions = document.querySelectorAll('input[name^="expands"]:checked');
        const expandActionsOptions = document.querySelectorAll('input[name^="actions-options"]:checked');

        const baseUrl = "https://api.movidesk.com/public/v1/tickets";
        const params = [];
        const selectSelectedOptions = [];
        const expandSelectedOptions = [];
        const expandActionsSelected = [];
        const filtersParams = [];

        if (id) {
            params.push(`id=${id}`);
        }

        if (createdDateSince && createdDateUntil) {
            filtersParams.push(`createdDate gt ${createdDateSince} and createdDate lt ${createdDateUntil}`);
        } else if (createdDateSince) {
            filtersParams.push(`createdDate eq ${createdDateSince}`);
        }

        selectOptions.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const value = checkbox.value;
                selectSelectedOptions.push(value);
            }
            if (index === selectOptions.length - 1 && expandOptions.length > 0) {
                selectSelectedOptions[selectSelectedOptions.length - 1] = selectSelectedOptions[selectSelectedOptions.length - 1].replace(',', '');
            }
        });

        expandOptions.forEach((checkbox) => {
            if (checkbox.checked) {
                const value = checkbox.value;
                expandSelectedOptions.push(value);
            }
        });

        expandActionsOptions.forEach((checkbox) => {
            if (checkbox.checked) {
                const value = checkbox.value;
                expandActionsSelected.push(value);
            }
        });

        if (selectSelectedOptions.length > 0) {
            params.push(`$select=${selectSelectedOptions.join(',')}`);
        }

        if (expandSelectedOptions.length > 0) {
            let expandOptions = '';
            if (expandSelectedOptions.includes('actions')) {
                // Se "actions" está presente, os demais itens devem vir após ele
                expandOptions += 'actions';
                if (expandActionsSelected.length > 0) {
                    expandOptions += `($select=${expandActionsSelected.join(',')})`;
                }
                if (expandSelectedOptions.length > 1) {
                    const remainingOptions = expandSelectedOptions.filter(option => option !== 'actions').join(',');
                    expandOptions += `,${remainingOptions}`;
                }
            } else {
                // Se "actions" não está presente, todos os itens podem vir em qualquer ordem
                expandOptions = expandSelectedOptions.join(',');
                if (expandActionsSelected.length > 0) {
                    expandOptions += `($select=${expandActionsSelected.join(',')})`;
                }
            }
            params.push(`$expand=${expandOptions}`);
        }


        if ((createdDateSince && createdDateUntil) || createdDateSince) {
            params.push(`$filter=${filtersParams.join(' and ')}`);
        }

        const url = `${baseUrl}?token=${token}&${params.join('&')}`;
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<p><strong>URL Gerada:</strong> ${url}</p>`;
    });

    actionsCheckbox.addEventListener('change', function () {
        if (actionsCheckbox.checked) {
            expandActions.classList.remove('hidden');
        } else {
            expandActions.classList.add('hidden');
        }
    });
});
