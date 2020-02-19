var TainacanExtraVueComponents = TainacanExtraVueComponents ? TainacanExtraVueComponents : {};

const TainacanMetadataCustomType = {
	name: "TainacanMetadataCustomType",
	props: {
        metadatum: Object,
        value: [String, Number, Array],
        disabled: false,
    },
    computed: {
        getStep: function() {
            if (this.metadatum && this.metadatum.metadatum.metadata_type_options && this.metadatum.metadatum.metadata_type_options.step)
                return this.metadatum.metadatum.metadata_type_options.step;
            else
                return 0.01;
        }
    },
    methods: {
        onInput: function(value) {
            this.$emit('input', value);
        },
        onBlur: function() {
            this.$emit('blur');
        }
    },
	template: `
	<b-input
            :disabled="disabled"
            :id="metadatum.metadatum.metadata_type_object.component + '-' + metadatum.metadatum.slug"
            :value="value"
            @input="onInput($event)"
            @blur="onBlur"
            type="number"
            lang="en"
            :step="getStep"/>
	`
}
TainacanExtraVueComponents["tainacan-metadata-type-custom"] = TainacanMetadataCustomType;
