
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_APIKEY);

const handleApiCall = (req, resp) => {
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
                return resp.status(400).json("Unable to work with API: " + err)
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return resp.status(400).json("Failed to get image")
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            resp.json(response)
        }
    );
};

const handleImage = (req, resp, database) => {
    const { id } = req.body;

    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => resp.json(entries[0].entries))
        .catch(err => resp.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}