# MaxlihToken

### Инструкция по запуску

1) Выполнить в терминале
```shell
npm install
```

2) В корне проекта добавить файл с названием `".env"` и с содержимым
```properties
ALCHEMY_API_KEY="ВАШ API КЛЮЧ ALCHEMY"
```

3) Выполнить в терминале
```shell
npx hardhat test
```

### Образец вывода теста
```
  MaxlihToken test
==============================================
MaxlihToken address: 0xF66CfDf074D2FFD6A4037be3A669Ed04380Aef2B
MaxlihToken balance: 2000000
==============================================
    ✔ deploy MaxlihToken (2953ms)
==============================================
uniswap pair factory contract address: 0xA47133702d315A2C1Abf10559dC6DB2A440641d4
uniswap router contract address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
uniswap pair contract total supply: 10000

swap MaxlihToken to USDT
MaxlihToken balance before:1990000
USDT balance before:990000
MaxlihToken balance after:1989900
USDT balance after:990098
==============================================
    ✔ create uniswap pair and make an exchange (253ms)
```
