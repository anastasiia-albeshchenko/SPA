$(document).ready(function () {
    
    // Domyślne ładowanie strony "O nas"
    loadPage('o_nas');

    // Obsługa kliknięć w menu nawigacji
    $('.nav-link, .navbar-brand').on('click', function (e) {
        e.preventDefault();
        
        // Pobranie nazwy strony z atrybutu data-page
        const page = $(this).data('page');
        
        // Zmiana klasy active w menu
        $('.nav-link').removeClass('active');
        if($(this).hasClass('nav-link')) {
            $(this).addClass('active');
        }

        loadPage(page);
    });

    /**
     * AJAX METODA 1: Fetch API
     * Ładowanie podstron HTML do kontenera #content
     */
    function loadPage(pageName) {
        const path = `pages/${pageName}.html`;

        fetch(path)
            .then(response => {
                if (!response.ok) throw new Error('Błąd sieci');
                return response.text();
            })
            .then(html => {
                // Wstawienie treści i efekt jQuery fadeIn
                $('#content').hide().html(html).fadeIn(600);
                
                // Uruchomienie specyficznych skryptów dla danych podstron
                if (pageName === 'o_nas') {
                    loadCuriosities(); // XMLHttpRequest
                } else if (pageName === 'menu') {
                    loadMenu(); // jQuery AJAX
                }
            })
            .catch(error => {
                $('#content').html('<div class="alert alert-danger">Nie udało się załadować strony.</div>');
                console.error('Błąd Fetch:', error);
            });
    }

    /**
     * AJAX METODA 2: XMLHttpRequest
     * Ładowanie ciekawostek z pliku .txt
     */
    function loadCuriosities() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/ciekawostki.txt', true);

        xhr.onload = function () {
            if (this.status === 200) {
                // Dzielimy tekst na linie i tworzymy listę
                const lines = this.responseText.split('\n');
                let htmlList = '<ul class="list-group list-group-flush">';
                lines.forEach(line => {
                    if(line.trim() !== "") {
                        htmlList += `<li class="list-group-item bg-transparent">☕ ${line}</li>`;
                    }
                });
                htmlList += '</ul>';
                
                // Wstawienie do elementu, który znajduje się w o_nas.html
                const curiosityContainer = document.getElementById('curiosities-container');
                if(curiosityContainer) {
                    curiosityContainer.innerHTML = htmlList;
                }
            }
        };

        xhr.send();
    }

    /**
     * AJAX METODA 3: jQuery Ajax
     * Ładowanie menu z pliku .json
     */
    function loadMenu() {
        $.ajax({
            url: 'data/menu.json',
            dataType: 'json',
            success: function (data) {
                let htmlContent = '';
                
                $.each(data, function (index, item) {
                    htmlContent += `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 menu-card border-0">
                                <div class="card-body text-center">
                                    <h5 class="card-title" style="color: #4B2E18; font-weight: bold;">${item.nazwa}</h5>
                                    <p class="card-text text-muted">${item.opis}</p>
                                    <div class="price-tag mt-3">${item.cena}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                $('#menu-container').html(htmlContent).hide().fadeIn(800);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#menu-container').html('<p class="text-danger text-center">Nie udało się pobrać menu.</p>');
                console.error("Błąd jQuery AJAX:", textStatus, errorThrown);
            }
        });
    }
});