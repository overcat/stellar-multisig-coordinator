const chai = require('chai');
const should = chai.should();
const utils = require('../../src/utils');

describe('parseNewXDR', () => {
    it('case 1', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAZAAd7gwAAAAEAAAAAAAAAAAAAAABAAAAAAAAAAsAAAAAB1a1swAAAAAAAAAA";
        const data = await utils.parseNewXDR(xdr);
        const expect = {
            threshold: 1,
            signers: [
                {
                    public_key: 'GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ',
                    weight: 1,
                    hint: '5b274ed2',
                    signed: false
                },
                {
                    public_key: 'GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI',
                    weight: 1,
                    hint: 'd01b0938',
                    signed: false
                },
                {
                    public_key: 'GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL',
                    weight: 1,
                    hint: 'd5a74734',
                    signed: false
                }]
        };
        data.should.eql(expect)
    });
    it('case 2', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAABLAAd7gwAAAAEAAAAAAAAAAAAAAADAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAABXdvcmxkAAAAAAAAAAAAAAsAAAAAB1a1swAAAAAAAAAFAAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAC3N0ZWxsYXIub3JnAAAAAAAAAAAAAAAAAA==";
        const data = await utils.parseNewXDR(xdr);
        const expect = {
            threshold: 2,
            signers: [
                {
                    public_key: 'GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ',
                    weight: 1,
                    hint: '5b274ed2',
                    signed: false
                },
                {
                    public_key: 'GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI',
                    weight: 1,
                    hint: 'd01b0938',
                    signed: false
                },
                {
                    public_key: 'GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL',
                    weight: 1,
                    hint: 'd5a74734',
                    signed: false
                }]
        };
        data.should.eql(expect)
    });
    it('case 3', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAABLAAd7gwAAAAEAAAAAAAAAAAAAAADAAAAAAAAAAEAAAAAltv/Bqzf7jYbxYdsjPR8PcSwA1Jer7L7HZ28BlsnTtIAAAAAAAAAAAX14QAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAADAAAAAAAAAAAAAAAAAAAACwAAAAAHVrWzAAAAAAAAAAA=";
        const data = await utils.parseNewXDR(xdr);
        const expect = {
            threshold: 3,
            signers: [
                {
                    public_key: 'GCLNX7YGVTP64NQ3YWDWZDHUPQ64JMADKJPK7MX3DWO3YBS3E5HNEZXJ',
                    weight: 1,
                    hint: '5b274ed2',
                    signed: false
                },
                {
                    public_key: 'GAIKYFQ7UN7E4I4ODK5IDNVSX5A3SGYZILDPJNUUIMWEI2OQDMETQ5XI',
                    weight: 1,
                    hint: 'd01b0938',
                    signed: false
                },
                {
                    public_key: 'GAX2OCBLZQBI5JLI6FR6ZE2R5BJQZ3DWH6ZIKNESUUP4KW6VU5DTI4XL',
                    weight: 1,
                    hint: 'd5a74734',
                    signed: false
                }]
        };
        data.should.eql(expect)
    });
    it('case 4', async () => {
        const xdr = "AAAAAG+sH7Ci7dYsCLuuZfpsge0hKQXAjsN1g6aiJAPMzx3sAAAAZAAAAAAHVrWzAAAAAAAAAAAAAAABAAAAAAAAAAsAAAAAAAHg8wAAAAAAAAAA";
        try {
            await utils.parseNewXDR(xdr);
        } catch (e) {
            e.code.should.eql('not_found');
            e.status.should.eql(400);
        }
    });
    it('case 5', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAyAAd7gwAAAAFAAAAAAAAAAAAAAACAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAtzdGVsbGFyLm9yZwAAAAAAAAAAAQAAAABvrB+wou3WLAi7rmX6bIHtISkFwI7DdYOmoiQDzM8d7AAAAAoAAAAEdGVzdAAAAAEAAAAFaGVsbG8AAAAAAAAAAAAAAdWnRzQAAABApTFfRDdIftZUtD1eWh2gOVSDht6bfR4Yh9uYi9RkKGtv7iK9P/Dh/OqbaWvdfufSY1lZIKtpFo6bSGm+zhuXBg==";
        try {
            await utils.parseNewXDR(xdr);
        } catch (e) {
            e.code.should.eql('op_source_diff');
            e.status.should.eql(400);
        }
    });
    it('case 6', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAZAAd7gwAAAAFAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAABXdvcmxkAAAAAAAAAAAAAAPVp0c0AAAAQEJnw+ZnIA/znvTrPVyMMB03imwTbJ3GoCk/LYEc9oVRneaPMBmC9Kz/hH4Nw/5sy1i6d5rAgNvKLCB6INTCEAjQGwk4AAAAQCpgUiCVfMJbOeq4jQkGlTFEJ6T2tSUMDXPlVNNWC/s2WPn2ISFA4MAgShvdYZTaTVIkfiCbqrjMMOIqEmEkQQRbJ07SAAAAQNJTGxD7ueCoEXxlQRTbVJDCrK+U7Fmv7WwBX2WfcMWImfkj4SybYazgKfyTInWcFaT/SPSRmkPNcyW8/HCb+AY=";
        try {
            await utils.parseNewXDR(xdr);
        } catch (e) {
            e.code.should.eql('bad_auth_extra');
            e.status.should.eql(400);
        }
    });
    it('case 7', async () => {
        const xdr = "AAAAAC+nCCvMAo6laPFj7JNR6FMM7HY/soU0kqUfxVvVp0c0AAAAZAAd7gwAAAAFAAAAAAAAAAAAAAABAAAAAAAAAAoAAAAFaGVsbG8AAAAAAAABAAAABXdvcmxkAAAAAAAAAAAAAALVp0c0AAAAQEJnw+ZnIA/znvTrPVyMMB03imwTbJ3GoCk/LYEc9oVRneaPMBmC9Kz/hH4Nw/5sy1i6d5rAgNvKLCB6INTCEAgkuVg9AAAAQPy363FvhceM+D6D62u/RkR1VLSRgRboZUPhXYX96stVUQmIeBBsGXi7pllT+JqKzPD85PUzX7KKJ66EIARTcQI=";
        try {
            await utils.parseNewXDR(xdr);
        } catch (e) {
            e.code.should.eql('bad_auth_exclude');
            e.status.should.eql(400);
        }
    });
});
