# AUTHENTICATION EVENTS

- "login" --> Fires when the user successfully logs in.
- "logout" --> Fires when the user logs out, including locking their account.
- "rejectedLogin" --> Fires if the user cancels the Metamask popups. This terminates the logging in process. 
- "tryingToConnect" --> Fires when the user is in the login process, i.e. when Metamask popups are present.
- "userSwitchedWallet" --> Fires when the user switches from one wallet to another (via the browser Metamask addon).