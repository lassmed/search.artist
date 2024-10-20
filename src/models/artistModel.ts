class Artist {
    name: string;
    mbid: string;
    url: string;
    image: Image[];

    constructor(name: string, mbid: string, url: string, image: Image[]) {
        this.name = name;
        this.mbid = mbid;
        this.url = url;
        this.image = image;
    }

    convertToArtistDto(): ArtistDto {
        const smallImagesURLs = this.image.filter(img => img.size === "small").map(img => img["#text"]).join(",");
        const imageUrls = this.image.map(img => img["#text"]).join(",");

        return new ArtistDto(this.name, this.mbid, this.url, smallImagesURLs, imageUrls);
    }
}

class ArtistDto {
    name: string;
    mbid: string;
    url: string;
    image_small: string;
    image: string;

    constructor(name: string, mbid: string, url: string, image_small: string, image: string) {
        this.name = name;
        this.mbid = mbid;
        this.url = url;
        this.image_small = image_small;
        this.image = image;
    }
}

class Image {
    "#text": string;
    size: "small" | "medium" | "large" | "extralarge" | "mega";

    constructor(text: string, size: "small" | "medium" | "large" | "extralarge" | "mega") {
        this["#text"] = text;
        this.size = size;
    }
}

export { Artist, ArtistDto };
