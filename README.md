

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

* How do I create a `:initialize` method on a model class?

  Initialize all values other than `@data`. Then, call `super(@data)`
  Doing it any other way increases the chance that you create
  an instance with `@data = nil`.

        def initialize *args
          @screen_name = if args.size == 2
                           args.pop
                         else
                           nil
                         end
          super(*args)
        end

* How do I create a `:read` method on a model class?

        class Screen_Name
          class << self
            def read_by_something something
              new TABLE.limit(1)[:something=>something], "Screen name not found."
            end
          end
        end

* How do I create an `:update` method on a model class?

  Update the record, then `:merge!` w/ @data
        def update data
          # Whatever you want.
          # Then update @data
          @data.merge!(
             TABLE.returning.where(...).update(...).
             first || {}
          )
        end










