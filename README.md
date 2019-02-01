# stellar-multisig-coordinator

Coordinate between several parties to generate a transaction for an Stellar account protected by multisig.

## Install

```bash
git clone https://github.com/overcat/stellar-multisig-coordinator.git
cd stellar-multisig-coordinator
nano config.json
nano knexfile.js
npm install
npm run migrate
npm start
```

## API

### Submit a new transaction

Request:

```bash
curl -X POST \
  https://multisig.tools/transaction \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'tx=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAAHVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw8%3D&undefined='
```

Response:

```json
{
    "id": "a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779",
    "created_at": "2019-01-31T12:52:16.017Z",
    "updated_at": "2019-01-31T12:52:16.017Z",
    "threshold": 2,
    "request_uri": "web+stellar:tx?callback=url%3Ahttps%3A%2F%2Fmultisig.tools%2Ftransaction%2Fa0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779&network_passphrase=Test%20SDF%20Network%20%3B%20September%202015&xdr=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAAHVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw8%3D",
    "signers": [
        {
            "public_key": "GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ",
            "signed": false,
            "weight": 1
        },
        {
            "public_key": "GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI",
            "signed": false,
            "weight": 1
        },
        {
            "public_key": "GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL",
            "signed": true,
            "weight": 1
        }
    ],
    "horizon_response": null
}
```

### Fetch the information of the transaction

Request:

```bash
curl -X GET https://multisig.tools/transaction/a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779
```

Response:

```json
{
    "id": "a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779",
    "created_at": "2019-01-31T12:52:16.017Z",
    "updated_at": "2019-01-31T12:52:16.017Z",
    "threshold": 2,
    "request_uri": "web+stellar:tx?callback=url%3Ahttps%3A%2F%2Fmultisig.tools%2Ftransaction%2Fa0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779&network_passphrase=Test%20SDF%20Network%20%3B%20September%202015&xdr=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAAHVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw8%3D",
    "signers": [
        {
            "public_key": "GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ",
            "signed": false,
            "weight": 1
        },
        {
            "public_key": "GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI",
            "signed": false,
            "weight": 1
        },
        {
            "public_key": "GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL",
            "signed": true,
            "weight": 1
        }
    ],
    "horizon_response": null
}
```

### Third party sign and submit it

Request:

```bash
curl -X POST \
  https://multisig.tools/transaction/a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779 \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'tx=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAALVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw%2FQGwk4AAAAQD1PanqLpBmL2sXwKaq7RfBiFs4c97sxN3vB9KEspyKGAhroh%2BhUxVm6QmlwtDT%2BvhbXj%2BCiNtyMKXgpWvSxEQw%3D&undefined='
```



Response:

```json
{
    "id": "a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779",
    "created_at": "2019-01-31T12:52:16.017Z",
    "updated_at": "2019-01-31T12:54:20.013Z",
    "threshold": 2,
    "request_uri": "web+stellar:tx?callback=url%3Ahttps%3A%2F%2Fmultisig.tools%2Ftransaction%2Fa0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779&network_passphrase=Test%20SDF%20Network%20%3B%20September%202015&xdr=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAALVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw%2FQGwk4AAAAQD1PanqLpBmL2sXwKaq7RfBiFs4c97sxN3vB9KEspyKGAhroh%2BhUxVm6QmlwtDT%2BvhbXj%2BCiNtyMKXgpWvSxEQw%3D",
    "signers": [
        {
            "public_key": "GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ",
            "signed": false,
            "weight": 1
        },
        {
            "public_key": "GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI",
            "signed": true,
            "weight": 1
        },
        {
            "public_key": "GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL",
            "signed": true,
            "weight": 1
        }
    ],
    "horizon_response": {
        "data": {
            "hash": "5adde28d77dd037a9fa4ede7b7ec32e39036f514856952f049ba916f17b9fb7a",
            "_links": {
                "transaction": {
                    "href": "https://horizon-testnet.stellar.org/transactions/5adde28d77dd037a9fa4ede7b7ec32e39036f514856952f049ba916f17b9fb7a"
                }
            },
            "ledger": 1994084,
            "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAKAAAAAAAAAAA=",
            "envelope_xdr": "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAALVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu/ZQrk6+3Q+Tw7SbE54hqDDjE7Uz3tI8PXo8/U8pgfASw/QGwk4AAAAQD1PanqLpBmL2sXwKaq7RfBiFs4c97sxN3vB9KEspyKGAhroh+hUxVm6QmlwtDT+vhbXj+CiNtyMKXgpWvSxEQw=",
            "result_meta_xdr": "AAAAAQAAAAIAAAADAB5tZAAAAAAAAAAAL6cIK8wCjqVo8WPsk1HoUwzsdj+yhTSSpR/FW9WnRzQAAAAXSHbkGAAd7gwAAAAJAAAAAwAAAAAAAAAAAAAAAAEBAgMAAAACAAAAABCsFh+jfk4jjhq6gbayv0G5GxlCxvS2lEMsRGnQGwk4AAAAAQAAAACW2/8GrN/uNhvFh2yM9Hw9xLADUl6vsvsdnbwGWydO0gAAAAEAAAAAAAAAAAAAAAEAHm1kAAAAAAAAAAAvpwgrzAKOpWjxY+yTUehTDOx2P7KFNJKlH8Vb1adHNAAAABdIduQYAB3uDAAAAAoAAAADAAAAAAAAAAAAAAAAAQECAwAAAAIAAAAAEKwWH6N+TiOOGrqBtrK/QbkbGULG9LaUQyxEadAbCTgAAAABAAAAAJbb/was3+42G8WHbIz0fD3EsANSXq+y+x2dvAZbJ07SAAAAAQAAAAAAAAAAAAAAAQAAAAMAAAADAB5tZAAAAAAAAAAAL6cIK8wCjqVo8WPsk1HoUwzsdj+yhTSSpR/FW9WnRzQAAAAXSHbkGAAd7gwAAAAKAAAAAwAAAAAAAAAAAAAAAAEBAgMAAAACAAAAABCsFh+jfk4jjhq6gbayv0G5GxlCxvS2lEMsRGnQGwk4AAAAAQAAAACW2/8GrN/uNhvFh2yM9Hw9xLADUl6vsvsdnbwGWydO0gAAAAEAAAAAAAAAAAAAAAEAHm1kAAAAAAAAAAAvpwgrzAKOpWjxY+yTUehTDOx2P7KFNJKlH8Vb1adHNAAAABdIduQYAB3uDAAAAAoAAAAEAAAAAAAAAAAAAAAAAQECAwAAAAIAAAAAEKwWH6N+TiOOGrqBtrK/QbkbGULG9LaUQyxEadAbCTgAAAABAAAAAJbb/was3+42G8WHbIz0fD3EsANSXq+y+x2dvAZbJ07SAAAAAQAAAAAAAAAAAAAAAAAebWQAAAADAAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAABWhlbGxvAAAAAAAAB3N0ZWxsYXIAAAAAAAAAAAA="
        },
        "status": 200
    }
}
```

### Get transactions that are related to me

Request:

```bash
curl -X GET 'https://multisig.tools/transactions/GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI?limit=10&offset=1'
```

Response:

```json
[
    {
        "id": "a0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779",
        "created_at": "2019-01-31T12:52:16.017Z",
        "updated_at": "2019-01-31T12:54:20.013Z",
        "threshold": 2,
        "request_uri": "web+stellar:tx?callback=url%3Ahttps%3A%2F%2Fmultisig.tools%2Ftransaction%2Fa0305379ab064b3ac826045e21ffb87f4989e3bfb766dfc869e67323c9c43779&network_passphrase=Test%20SDF%20Network%20%3B%20September%202015&xdr=AAAAAC%2BnCCvMAo6laPFj7JNR6FMM7HY%2FsoU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAALVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu%2FZQrk6%2B3Q%2BTw7SbE54hqDDjE7Uz3tI8PXo8%2FU8pgfASw%2FQGwk4AAAAQD1PanqLpBmL2sXwKaq7RfBiFs4c97sxN3vB9KEspyKGAhroh%2BhUxVm6QmlwtDT%2BvhbXj%2BCiNtyMKXgpWvSxEQw%3D",
        "signers": [
            {
                "public_key": "GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ",
                "signed": false,
                "weight": 1
            },
            {
                "public_key": "GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI",
                "signed": true,
                "weight": 1
            },
            {
                "public_key": "GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL",
                "signed": true,
                "weight": 1
            }
        ],
        "horizon_response": {
            "data": {
                "hash": "5adde28d77dd037a9fa4ede7b7ec32e39036f514856952f049ba916f17b9fb7a",
                "_links": {
                    "transaction": {
                        "href": "https://horizon-testnet.stellar.org/transactions/5adde28d77dd037a9fa4ede7b7ec32e39036f514856952f049ba916f17b9fb7a"
                    }
                },
                "ledger": 1994084,
                "result_xdr": "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAAKAAAAAAAAAAA=",
                "envelope_xdr": "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAZAAd7gwAAAAKAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAAB3N0ZWxsYXIAAAAAAAAAAALVp0c0AAAAQCyIFULmKSU9zGXeuwKmlAGFNY8q2MMOgtKUACh4Eu/ZQrk6+3Q+Tw7SbE54hqDDjE7Uz3tI8PXo8/U8pgfASw/QGwk4AAAAQD1PanqLpBmL2sXwKaq7RfBiFs4c97sxN3vB9KEspyKGAhroh+hUxVm6QmlwtDT+vhbXj+CiNtyMKXgpWvSxEQw=",
                "result_meta_xdr": "AAAAAQAAAAIAAAADAB5tZAAAAAAAAAAAL6cIK8wCjqVo8WPsk1HoUwzsdj+yhTSSpR/FW9WnRzQAAAAXSHbkGAAd7gwAAAAJAAAAAwAAAAAAAAAAAAAAAAEBAgMAAAACAAAAABCsFh+jfk4jjhq6gbayv0G5GxlCxvS2lEMsRGnQGwk4AAAAAQAAAACW2/8GrN/uNhvFh2yM9Hw9xLADUl6vsvsdnbwGWydO0gAAAAEAAAAAAAAAAAAAAAEAHm1kAAAAAAAAAAAvpwgrzAKOpWjxY+yTUehTDOx2P7KFNJKlH8Vb1adHNAAAABdIduQYAB3uDAAAAAoAAAADAAAAAAAAAAAAAAAAAQECAwAAAAIAAAAAEKwWH6N+TiOOGrqBtrK/QbkbGULG9LaUQyxEadAbCTgAAAABAAAAAJbb/was3+42G8WHbIz0fD3EsANSXq+y+x2dvAZbJ07SAAAAAQAAAAAAAAAAAAAAAQAAAAMAAAADAB5tZAAAAAAAAAAAL6cIK8wCjqVo8WPsk1HoUwzsdj+yhTSSpR/FW9WnRzQAAAAXSHbkGAAd7gwAAAAKAAAAAwAAAAAAAAAAAAAAAAEBAgMAAAACAAAAABCsFh+jfk4jjhq6gbayv0G5GxlCxvS2lEMsRGnQGwk4AAAAAQAAAACW2/8GrN/uNhvFh2yM9Hw9xLADUl6vsvsdnbwGWydO0gAAAAEAAAAAAAAAAAAAAAEAHm1kAAAAAAAAAAAvpwgrzAKOpWjxY+yTUehTDOx2P7KFNJKlH8Vb1adHNAAAABdIduQYAB3uDAAAAAoAAAAEAAAAAAAAAAAAAAAAAQECAwAAAAIAAAAAEKwWH6N+TiOOGrqBtrK/QbkbGULG9LaUQyxEadAbCTgAAAABAAAAAJbb/was3+42G8WHbIz0fD3EsANSXq+y+x2dvAZbJ07SAAAAAQAAAAAAAAAAAAAAAAAebWQAAAADAAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAABWhlbGxvAAAAAAAAB3N0ZWxsYXIAAAAAAAAAAAA="
            },
            "status": 200
        }
    }
]
```

