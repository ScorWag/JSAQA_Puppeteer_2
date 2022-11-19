Feature: Cinema ticket order
    Scenario: One seat order
        Given user is on "http://qamid.tmweb.ru" page
        When user selects hall "Зал 1", row 7, place 1 and plus 1 days from the current date
        Then order completed, text appears "Покажите QR-код нашему контроллеру для подтверждения бронирования."

    Scenario: Some seats order
        Given user is on "http://qamid.tmweb.ru" page
        When user selects hall "Зал 1", row 7 / place 2 and row 7 / place 3, plus 1 days from the current date
        Then order completed, text appears "Покажите QR-код нашему контроллеру для подтверждения бронирования."

    Scenario: Order a reserved seat
        Given user is on "http://qamid.tmweb.ru" page
        When user selects hall "Зал 1", row 6, place 2 and plus 1 days from the current date        
        Then trying to place the same order: hall "Зал 1", row 7 / place 2, plus 1 days from the current date, order uncompleted
        
    