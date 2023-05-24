class Translation {
    dict = {
        "en": {
            'username': 'username',
            'email': 'email'
        },
        "nl": {
            'username': 'gebruikersnaam',
            'email': 'e-mail'
        }
    };

    constructor() {}

    getTranslation(lang, key) {
        console.log(lang, key, this.dict);
        return this.dict[lang][key];
    }
}

module.exports = Translation;