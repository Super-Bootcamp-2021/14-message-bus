# Tugas

Tambahkan Performance Service pada aplikasi yang sudah dibuat sebelumnya

![service diagram](tugas-besar-task system.png)

1. performance service
    menyediakan informasi mengenai transaksi yang dilakukan
    - menampilkan jumlah task dan worker diakumulasikan (misalkan task.added rumusnya jumlah yg sebelumnya + 1)
    
Data yang diinginkan
- total pekerja (misalkan di kv nya: key: worker.added, value: 3. Ketika ada yang request worker.added, value nya nambah jadi 4, dst)
- total tugas
- total tugas yang selesai
- total tugas yang dibatalkan

2. object storage
    menggunakan minio untuk upload file
    - ganti file system ke object storage
