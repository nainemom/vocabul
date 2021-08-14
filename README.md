## Vocabul
Improve your vocabulary from command-line!

### Installation?
```bash
npm i vocabul
```
## Usage
```bash
vocabul [...arguments]
```

### Arguments
| Argument | Description | Default |
|-|-|-|
| --action -a | Required and Should be one of "translate", "random", or "start" | |
| --dictionary -d | Local dictionary name | "default" |
| --from -f | Source language for "translate" action | "auto" |
| --to -t | Target language for "translate" action | |
| --word -w | Input word for "translate" action | |
| --add -y | Add translated word to dictionary | |
| --period -p | "start" action interval period | 1 |
| --command -c | "start" action run command | "notify-send" |
| --version -v | Show installed version | |
| --help -h | Show help | |

### Example
```terminal
vocabul -a translate -f en -t fa -y -w Hello # Translate "Hello" from english to persian and add it to "default" dictonary
vocabul -a random -d custom # Show word:translation from "custom" dictonary
vocabul -a start -p 2 -c "notify-send" # Notify word:translation from "default" dictonary every 2 minute
```
