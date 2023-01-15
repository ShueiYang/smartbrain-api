const { database } = require("../database/postgres");

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_APIKEY);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            // This is the model ID of a FACE DETECT model. We may use any other public or custom model ID.
            model_id: "face-detection",
            version_id: "6dc7e46bc9124c5c8824be4822abe105",
            inputs: [{data: {image: {url: req.body.input }}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Unable to work with API: " + err);
                return res.status(503).json({message: `Unable to work with API: ${err}`})
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return res.status(404).json({message: `Error: ${response.status.description}`})
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response);
        }
    );
};

const handleImage = (req, res) => {
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