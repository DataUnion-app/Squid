const blockies = require('ethereum-blockies-png')

export default {
    blockies(seed) {
        return blockies.createDataURL({seed: seed});
    }
}