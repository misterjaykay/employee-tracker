SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist
FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year)
WHERE top_albums.artist = 'eminem' AND top5000.artist = 'eminem' ORDER BY top_albums.year, top_albums.position;