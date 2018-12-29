
/*

  // STUDENT HOUSING PACKAGE
        - certain roommates & uncertain roommates
        - budget
        - urgency
        - tour availability
        - coop schedule
        - biggest decision factors
        - guarantors
        - desired types of units
        - target movein
        - programme (great for promoting buildings with high concentrations of classmates)
        - entire unit or rooms

  // TORONTO RENTAL PACKAGE
        - urgency
        - budget
        - credit score
        - target movein
        - group size & details
        - first time renting
        - entire unit or rooms

*/

/*

  HOW DO WE DETERMINE WHICH PACKAGE TO USE?
        - the intro dialog should be the same, acting as a classifier
        - location --> waterloo vs toronto
        - employment status --> fulltime vs student
        - frontend and data is coupled together, so unfortunetely we cannot dynamically
          determine questions on the backend unless we use server-side HTML rendering
        - tooltips should also be customized to the audience package

        - questions are asked via each inquiry

*/


/*

  ORDER OF QUESTIONS ASKED
        - First inquiry, no login --> simple, regular flow minus general search --> might already have account, check phone --> after inquiry, ask general search
        - First inquiry, yes login --> dynamic, ask next specific question

*/
