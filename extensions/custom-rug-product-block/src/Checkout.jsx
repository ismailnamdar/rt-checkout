import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const {target, instructions, applyAttributeChange} = shopify;
  const cartLine = target.value;
  const sendProofAttribute = cartLine.attributes.find(
    (attr) => attr.key === '__Send proof'
  );
  const previewImageAttribute = cartLine.attributes.find(
    (attr) => attr.key === '__Product preview image' || attr.key === 'DOWNLOAD PROOF'
  );
  const originalImageAttribute = cartLine.attributes.find(
    (attr) => attr.key === '__Original image'
  );
  const commentsAttribute = cartLine.attributes.find(
    (attr) => attr.key === '__Comments'
  );
  const [sendProof, setSendProof] = useState(
    sendProofAttribute?.value === 'yes'
  );
  const [notesEnabled, setNotesEnabled] = useState(
    Boolean(commentsAttribute?.value)
  );

  const [comments, setComments] = useState(
    commentsAttribute?.value || ''
  );

  if (!cartLine?.attributes) {
    return null;
  }
  const originalLinkUrl = originalImageAttribute?.value;
  const previewLinkUrl = previewImageAttribute?.value;

  async function handleCheckboxChange(event) {
    const checked = event.target.checked;
    setSendProof(checked);

    if (!instructions.value?.attributes?.canUpdateAttributes) {
      return;
    }

    await applyAttributeChange({
      type: 'updateAttribute',
      key: '__Send proof',
      value: checked ? 'yes' : 'no',
    });
  }

  async function handleNotesToggle(event) {
    const checked = event.target.checked;
    setNotesEnabled(checked);

    if (!instructions.value?.attributes?.canUpdateAttributes) return;

    if (!checked) {
      setComments('');
      await applyAttributeChange({
        type: 'updateAttribute',
        key: '__Comments',
        value: '',
      });
    }
  }

  async function handleCommentsChange(event) {
    const value = event.target.value;
    setComments(value);

    if (!instructions.value?.attributes?.canUpdateAttributes) return;

    await applyAttributeChange({
      type: 'updateAttribute',
      key: '__Comments',
      value,
    });
  }


  return (
    <s-stack gap="small">
      <s-text></s-text>
      <s-stack gap="base">
        {originalLinkUrl && <s-link href={originalLinkUrl}>
          <s-text type="generic">
            Original photo
          </s-text>
        </s-link>}

        <s-checkbox
            label="Send proof before production"
            checked={sendProof}
            onChange={handleCheckboxChange}
        />

        {previewLinkUrl && <s-box
          padding="base"
          border="base"
          borderRadius="large"
          background="subdued"
        >
          <s-stack>
            <s-link href={previewLinkUrl}>
              <s-text type="strong">
                Rug preview
              </s-text>
            </s-link>

            <s-box borderRadius="base" overflow="hidden">
              <s-image
                src={previewLinkUrl}
                alt="Product preview image"
                aspectRatio="1/1"
              />
            </s-box>
          </s-stack>
        </s-box>}

        {/* Add notes toggle */}
        <s-box
          padding="base"
          border="base"
          borderRadius="large"
          background="subdued"
        >
          <s-stack gap="small">
            <s-checkbox
              label="Add notes"
              checked={notesEnabled}
              onChange={handleNotesToggle}
            />

            {notesEnabled && (
              <s-text-area
                label="Notes"
                rows={2}
                value={comments}
                onChange={handleCommentsChange}
              />
            )}
          </s-stack>
        </s-box>
      </s-stack>
    </s-stack>
  );
}
