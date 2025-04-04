## Getting Started

Clone the repository and run the following commands:



## Run Locally
(*Require kinde auth API & Mongo DB String for DB Operations)



.env.local (put this in root folder)
KINDE_CLIENT_ID=""
KINDE_CLIENT_SECRET=""
KINDE_ISSUER_URL=""
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
MONGODB_URI=mongodb+srv://username:password@cluster0.wpx5n08.mongodb.net/employee
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""




```sh
git clone https://github.com/yesutkarsh/m16project.git
cd employee-management

npm install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
``` 

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


