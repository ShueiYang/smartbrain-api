
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_APIKEY);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a FACE DETECT model. We may use any other public or custom model ID.
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: req.body.input }}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Unable to work with API: " + err);
                return res.status(503).json("Unable to work with API: " + err)
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return res.status(404).json("Image not found")
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
};

const handleImage = (req, res, database) => {
    const { id } = req.body;

    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0].entries))
        .catch(err => res.status(400).json(`unable to get entries: ${err}`))
}

module.exports = {
    handleImage,
    handleApiCall
}