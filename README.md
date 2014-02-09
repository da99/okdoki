

Common Tasks
-----------------

    bin/model create My\_Model

    bin/migrate create My\_Model table


Okdoki.com
----------

Friendship-based activities.


Complexity
----------

* Authorization (aka Permission):
  * "Consumer" -> "Multi. Producers" (inbox)
  * "Consumer" -> "Producer"         (screen name homepage)

  Temp answer: Screen name orientation, sub-queries

* One Customer, Multi. Screen Names

  Temp answer:
    Unique ids, same table for SN, sub-SNs.
    <br />
    Different table for group based permission.

F.A.Q.
------

* How are authorization for actions done at the model level?

  The USER is obtained from the session and validations
  are used to ensure USER is allowed to do the intended
  action.
