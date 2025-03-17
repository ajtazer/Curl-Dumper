# Dumper 🚀
**A free, ephemeral file-sharing service built entirely on Cloudflare's free tier**  
*(Pronounced "Cum Dump" - because why not)*  

<img width="682" alt="image" src="https://github.com/user-attachments/assets/5d15bd6a-12a0-4c2f-bae7-b5eb34973e74" />


## How It's Made 🛠️
**Cloudflare Stack:**
- 🧑💻 **Workers** - Handle 100k reqs/day free
- 📦 **R2 Storage** - 10GB free storage (no egress fees!)
- 🖼️ **Pages** - Hosts our fabulous landing page
- 🔄 **DNS** - Magic routing sauce

## Upload anything faster than you can say "curl"
```bash
curl -T your_file.txt https://dump.ajtazer.xyz
```
## Download before it's gone
```bash
wget https://dump.ajtazer.xyz/files/your_file.txt
```
# Why This Rocks 🤘
- CLI Mogging
- Single curl command
- Zero config
- Auto-nuked after 24h
- Literally free
