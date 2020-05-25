Feature: Show Article Page and Article itself

Scenario: Showing default list of articles on home page 
  Given User has logged in
  But User has not entered child birth data
  When User opens home page 
  Then list of popular articles is shown
  But list of popular articles is not contextualized (by age, gender, period of the year)
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238732

Scenario: Showing personalized list of articles on home page 
  Given User has logged in
  * User has entered child birth data
  When User opens home page
  Then categorized list of articles is shown on home page
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238736

Scenario: Default ordering of articles within the category
  Given User has logged in
  When user has opened the home page
  Then articles in the list from the certain category appear ordered by date added

Scenario: Conditional ordering of articles within the category
  Given User has logged in
  When user has opened the home page
  * use has opened one or more articles from the certain category
  Then articles in the list from the certain category appear ordered by date opened and date added
  # (opened articles are moved at the end of the list, similar like Instagram stories)


Scenario: Showing development content segment on the home page
  Given User has logged in
  * user has entered child birth data
  * user has opened the home page
  When child age approaches predefined development period to <<XX>> days
  Then additional segment is shown on the home page above the default article collections that gives more information about child development
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390238737

Scenario: Showing related articles on article page
  Given User has opened the article from the certain category
  When There are more than one article from the category user has opened
  Then Related articles are shown on article page ordered randomly
  # https://projects.invisionapp.com/share/GBUJ3D6CV3E#/screens/390239227