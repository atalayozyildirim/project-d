# Project-D CRM backend servisi

## Kurulum

1. Projeyi klonlayın:
    ```bash
    git clone 
    cd project-d
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3. [.env](http://_vscodecontentref_/0) dosyasını oluşturun ve gerekli çevresel değişkenleri ekleyin:
    ```properties
    MODE=Development
    SECRET_KEY=your_secret_key
    MONGO_URI=mongodb://localhost:27017/project
    JWT_SECRET=your_jwt_secret_key
    ```

4. Docker kullanarak MongoDB'yi başlatın:
    ```bash
    docker pull mongo
    docker run -d -p 27017:27017 --name my-mongo mongo
    ```

5. Sunucuyu başlatın:
    ```bash
    npm run dev
    ```

## Routes

### Auth Routes

- **POST api/auth/login**
    - Açıklama: Kullanıcı girişi yapar.
    - Body:
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```

- **POST api/auth/register**
    - Açıklama: Yeni kullanıcı kaydı yapar.
    - Body:
        ```json
        {
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123"
        }
        ```

### User Routes

- **GET api/user/all**
    - Açıklama: Tüm kullanıcıları listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına kullanıcı sayısı (varsayılan: 10)

- **POST api/user/add**
    - Açıklama: Yeni kullanıcı ekler.
    - Body:
        ```json
        {
          "name": "Jane Doe",
          "email": "jane@example.com",
          "password": "password123"
        }
        ```

- **DELETE api/user/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip kullanıcıyı siler.
    - Params:
        - `id`: Kullanıcı ID'si

### Employer Routes

- **GET api/emp/all**
    - Açıklama: Tüm işverenleri listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına işveren sayısı (varsayılan: 10)

- **POST api/emp/add**
    - Açıklama: Yeni işveren ekler.
    - Body:
        ```json
        {
          "name": "Company ABC",
          "email": "contact@companyabc.com",
          "phone": "1234567890",
          "address": "123 Street, City"
        }
        ```

- **DELETE api/emp/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip işvereni siler.
    - Params:
        - `id`: İşveren ID'si

### Customer Routes

- **GET api/customer/all**
    - Açıklama: Tüm müşterileri listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına müşteri sayısı (varsayılan: 10)

- **POST api/customer/add**
    - Açıklama: Yeni müşteri ekler.
    - Body:
        ```json
        {
          "name": "Customer XYZ",
          "email": "customer@xyz.com",
          "company": "XYZ Ltd.",
          "phone": "0987654321",
          "address": "456 Avenue, City"
        }
        ```

- **DELETE api/customer/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip müşteriyi siler.
    - Params:
        - `id`: Müşteri ID'si

### Invoice Routes

- **GET api/invoice/all**
    - Açıklama: Tüm faturaları listeler.
    - Query Params:
        - `page`: Sayfa numarası (varsayılan: 1)
        - `limit`: Sayfa başına fatura sayısı (varsayılan: 10)

- **POST api/invoice/add**
    - Açıklama: Yeni fatura ekler.
    - Body:
        ```json
        {
          "customer": "Customer XYZ",
          "amount": 1000,
          "dueDate": "2025-03-15"
        }
        ```

- **DELETE api/invoice/delete/:id**
    - Açıklama: Belirtilen ID'ye sahip faturayı siler.
    - Params:
        - `id`: Fatura ID'si

## Middleware

- **currentUser**
    - Açıklama: Geçerli kullanıcıyı doğrular ve kullanıcı bilgilerini request objesine ekler.

## Modeller

### AuthModel

- **name**: String, required
- **email**: String, required, unique
- **password**: String, required
- **token**: String, 
optional- **role**: String, optional, default: "user"

### CustomerModel

- **name**: String, required
- **email**: String, required, unique
- **company**: String, required
- **phone**: String, required
- **address**: String, required
- **createdAt**: Date, default: Date.now
- **updatedAt**: Date, default: Date.now

## Util

### generateJWT

- Açıklama: Kullanıcı ID'si ile JWT oluşturur.
- Parametreler: `userId`
- Dönüş: Promise (token)

### generateRefreshToken

- Açıklama: Kullanıcı ID'si ile refresh token oluşturur.
- Parametreler: `userId`
- Dönüş: Promise (token)

### Author

## Atalay Özyıldırım