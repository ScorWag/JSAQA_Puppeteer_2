Feature: Cinema ticket order
    Scenario: One seat order
        Given user is on "http://qamid.tmweb.ru" page
        When user selects plus 3 days from the current date
        When selects hall "Зал 1"
        When selects row 3 / place 1
        When click button - Забронировать
        Then order completed, text appears "Покажите QR-код нашему контроллеру для подтверждения бронирования."

    Scenario: Some seats order
        Given user is on "http://qamid.tmweb.ru" page
        When user selects plus 3 days from the current date
        When selects hall "Зал 1"
        When selects row 1 / place 2
        When selects row 1 / place 3
        When click button - Забронировать
        Then order completed, text appears "Покажите QR-код нашему контроллеру для подтверждения бронирования."    

    Scenario: Order a reserved seat
        Given user is on "http://qamid.tmweb.ru" page
        When user selects plus 3 days from the current date
        When selects hall "Зал 1"
        When selects row 5 / place 2
        When click button - Забронировать
        When user again is on "http://qamid.tmweb.ru" page
        When user selects plus 3 days from the current date
        When selects hall "Зал 1"
        When selects row 5 / place 2
        Then button - Забронировать is not active, order uncompleted
        
    