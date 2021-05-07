Test

`npm run test`

Run locally

`npm run dev`

Build for production

`npm run build`

Structure

- Router

    `src/routes.js`

    There has a login middleware which checks the Authentication Handler to check if token exists. If user is not authenticated, it redirects to `/login`, Otherwise, process next request.

- Authentication Handler

    `src/common/auth.js`
    
    This is inheritied from the react frontend app and uses the same function.
    
    In order to initialize Web3 handler, to get sign request and to get Backend api token, you can do like this.

    ```
    import Auth from 'common/auth';
    Auth.authenticate(accountId);
    ```

    You can get token from `Auth.token()`

- API Handler

    `src/common/api.js`

    It's pretty self-explanatory

    You can just call `API.[api]` to fetch and this will return Promise object.

- Sample Data

    Currently sample data is located in `static/photos/sample.json`

- Models
    
    A Model is a helper of a collection used for the app located in `src/model`.
    
    For example, `Photo` model inherits `Rest` Model and this Rest Model inherits `Model` class

    - Photo model
        
        Concrete class that contains helper functions including get url of asset, including GetThumbnail, GetCountry etc

    - Rest Model
        
        This has some virtual functions need to be reimplemented in concrete class, including `getCollectionResource` which returns the Model type. According to this value, api call endpoint will be determined.

        This has 4 common functions which are for CRUD resources in restful API.

    - Model

        Has basic function to get and set value.